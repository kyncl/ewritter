<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the input
        $validated = $request->validate([
            'header'  => 'required|string|max:255',
            'content' => 'required|string',
            'user_ids' => 'required|array', // Expecting an array of user IDs
            'user_ids.*' => 'exists:users,id', // Ensure each ID exists in the users table
        ]);

        // 2. Create the Article
        $article = Article::create([
            'header'  => $validated['header'],
            'content' => $validated['content'],
        ]);

        // 3. Create the many-to-many relationship
        // This inserts rows into the 'article_user' table automatically
        $article->users()->attach($validated['user_ids']);

        return response()->json([
            'message' => 'Article created successfully!',
            'article' => $article->load('users')
        ], 201);
    }

    public function showArticle($id)
    {
        $article = Article::with("users")->findOrFail($id);
        return response()->json($article);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $isOwner = $article->users()
            ->where('user_id', auth()->guard()->id())
            ->exists();

        if (! $isOwner) {
            return response()->json(['message' => 'You are not authorized to delete this article.'], 403);
        }
        $article->delete();
        return response()->json(['message' => 'Article deleted successfully']);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $validated = $request->validate([
            'header' => 'string|max:255',
            'content' => 'string',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);
        $isOwner = $article->users()
            ->where('user_id', auth()->guard()->id())
            ->exists();

        if (! $isOwner) {
            return response()->json(['message' => 'You are not authorized to change this article.'], 403);
        }
        $article->update($request->only(['header', 'content']));
        if ($request->has('user_ids')) {
            $article->users()->sync($validated['user_ids']);
        }
        return response()->json($article->load('users'));
    }

    public function getByUser($userId)
    {
        $user = User::findOrFail($userId);
        return response()->json($user->articles);
    }

    public function getOtherArticles($userId)
    {
        $articles = Article::whereDoesntHave('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with('users')
            ->latest()
            ->paginate(10);
        return response()->json($articles);
    }

    public function list()
    {
        $articles = Article::with('users')
            ->latest()
            ->paginate(10);
        return response()->json($articles);
    }
}
