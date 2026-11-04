<?php

use App\Http\Controllers\Admin\CompanyAdministrationController;
use App\Http\Controllers\Admin\CountriesController;
use App\Http\Controllers\Admin\OfferSourcesController;
use App\Http\Controllers\CompanyPortalController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\OfferApplicationController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/offres', [JobOfferController::class, 'index'])->name('offers.index');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/entreprise', [CompanyPortalController::class, 'index'])->name('company.dashboard');
    Route::post('/entreprise', [CompanyPortalController::class, 'storeProfile'])->middleware('verified')->name('company.profile.store');
    Route::post('/entreprise/offres', [CompanyPortalController::class, 'storeOffer'])->middleware('verified')->name('company.offers.store');
    Route::patch('/entreprise/offres/{offer}', [CompanyPortalController::class, 'updateOffer'])->middleware('verified')->name('company.offers.update');
    Route::delete('/entreprise/offres/{offer}', [CompanyPortalController::class, 'deactivateOffer'])->middleware('verified')->name('company.offers.deactivate');
    Route::patch('/entreprise/candidatures/{application}', [CompanyPortalController::class, 'updateApplicationStatus'])->middleware('verified')->name('company.applications.update');

    Route::get('/offres/{offer}/postuler', [OfferApplicationController::class, 'create'])->middleware('verified')->name('applications.create');
    Route::post('/offres/{offer}/postuler', [OfferApplicationController::class, 'store'])->middleware('verified')->name('applications.store');
    Route::get('/mes-candidatures', [OfferApplicationController::class, 'index'])->name('applications.index');
    Route::delete('/mes-candidatures/{application}', [OfferApplicationController::class, 'withdraw'])->name('applications.withdraw');
});

Route::middleware(['auth', 'can:manage-offer-sources'])
    ->prefix('admin/offres')
    ->name('admin.offer-sources.')
    ->group(function () {
        Route::get('/', [OfferSourcesController::class, 'index'])->name('index');
        Route::get('/pays', [CountriesController::class, 'index'])->name('countries');
        Route::patch('/pays/{country}', [CountriesController::class, 'toggle'])->name('countries.toggle');
        Route::patch('/{slug}', [OfferSourcesController::class, 'toggle'])->name('toggle');
        Route::post('/{slug}/synchroniser', [OfferSourcesController::class, 'sync'])
            ->middleware('throttle:1,1')
            ->name('sync');
    });

Route::middleware(['auth', 'can:manage-companies'])
    ->prefix('admin/entreprises')
    ->name('admin.companies.')
    ->group(function () {
        Route::get('/', [CompanyAdministrationController::class, 'index'])->name('index');
        Route::patch('/{company}/verification', [CompanyAdministrationController::class, 'verifyCompany'])->name('verify');
        Route::patch('/offres/{offer}', [CompanyAdministrationController::class, 'moderateOffer'])->name('moderate-offer');
    });

require __DIR__.'/settings.php';
