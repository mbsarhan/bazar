<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User; 
use Carbon\Carbon;   

class PruneUnverifiedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:prune-unverified';
    

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes unverified users who are older than one week.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to prune old, unverified users...');

        // 1. Define the cutoff date: 1 week ago from now.
        $cutoffDate = Carbon::now()->subWeek();

        // 2. Build the query to find the users to be deleted.
        // We look for users where:
        // - 'email_verified_at' is NULL (they have never verified their email)
        // - AND 'created_at' is older than our 1-week cutoff date.
        $usersToDelete = User::whereNull('email_verified_at')
                             ->where('created_at', '<=', $cutoffDate);

        // 3. Get the count of users we are about to delete, for logging purposes.
        $count = $usersToDelete->count();

        if ($count > 0) {
            // 4. Delete the found users from the database.
            $usersToDelete->delete();
            $this->info("Successfully deleted {$count} unverified users.");
        } else {
            $this->info('No old, unverified users found to delete.');
        }

        return 0; // Return 0 for success
    }
}
