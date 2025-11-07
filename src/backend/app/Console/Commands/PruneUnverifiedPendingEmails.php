<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class PruneUnverifiedPendingEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:prune-unverified-pending-emails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes unverified pending email changes that are older than one week.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to prune old, unverified pending email changes...');

        // 1. Define the cutoff date: now.
        $cutoffDate = Carbon::now();

        // 2. Build the query to find the users whose pending email change has expired.
        // We look for users where:
        // - 'pending_email_expires_at' is not NULL
        // - AND 'pending_email_expires_at' is older than or equal to the current time.
        $usersToUpdate = User::whereNotNull('pending_email_expires_at')
                             ->where('pending_email_expires_at', '<=', $cutoffDate);

        // 3. Get the count of users we are about to update, for logging purposes.
        $count = $usersToUpdate->count();

        if ($count > 0) {
            // 4. Update the found users' records to nullify the pending email fields.
            $usersToUpdate->update([
                'pending_email' => null,
                'pending_email_verification_code' => null,
                'pending_email_expires_at' => null,
            ]);
            $this->info("Successfully pruned {$count} unverified pending email changes.");
        } else {
            $this->info('No old, unverified pending email changes found to prune.');
        }

        return 0; // Return 0 for success
    }
}
