<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

Route::get("/articles", [ArticleController::class, 'list'])
    ->name("articles.list");

Route::get("/article/{id}", [ArticleController::class, 'showArticle'])
    ->name("article.sho");

Route::post('/articleCreate', [ArticleController::class, 'store'])
    ->middleware('auth')
    ->name('articles.store');

Route::put('/articleUpdate/{id}', [ArticleController::class, 'update'])
    ->middleware('auth')
    ->name('articles.update');

Route::delete('/article/{id}', [ArticleController::class, 'destroy'])
    ->middleware('auth')
    ->name('articles.destroy');

Route::get('/articles/{userId}', [ArticleController::class, 'getByUser'])
    ->middleware('auth')
    ->name('articles.list');

Route::get('/articles/{userId}/non/user', [ArticleController::class, 'getOtherArticles'])
    ->middleware('auth')
    ->name('articles.listNonUsers');
