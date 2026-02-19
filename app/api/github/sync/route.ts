import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { projectId, repoName, files, token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "GitHub Token Missing" }, { status: 401 });
    }

    const octokit = new Octokit({ auth: token });
    
    // 1. Get Authenticated User
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // 2. Repo check ya create karo
    try {
      await octokit.repos.get({ owner, repo: repoName });
    } catch (e) {
      await octokit.repos.createForAuthenticatedUser({ 
        name: repoName, 
        auto_init: true,
        description: "Created via CodeMapers AI IDE"
      });
      // Thoda wait taaki GitHub repo initialize kar le
      await new Promise(r => setTimeout(r, 2000));
    }

    // 3. Files ko GitHub tree format mein convert karo
    const fileEntries = files.map((file: any) => ({
      path: file.path || file.name,
      mode: '100644', // normal file
      type: 'blob',
      content: file.content
    }));

    // 4. Latest commit ka SHA lo
    const { data: ref } = await octokit.git.getRef({ owner, repo: repoName, ref: 'heads/main' });
    const latestCommitSha = ref.object.sha;

    // 5. New Tree create karo
    const { data: tree } = await octokit.git.createTree({
      owner,
      repo: repoName,
      base_tree: latestCommitSha,
      tree: fileEntries
    });

    // 6. New Commit create karo
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo: repoName,
      message: `🚀 Sync from CodeMapers IDE - ${new Date().toLocaleString()}`,
      tree: tree.sha,
      parents: [latestCommitSha]
    });

    // 7. Branch update karo
    await octokit.git.updateRef({
      owner,
      repo: repoName,
      ref: 'heads/main',
      sha: commit.sha
    });

    return NextResponse.json({ success: true, url: `https://github.com/${owner}/${repoName}` });

  } catch (error: any) {
    console.error("Git Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}