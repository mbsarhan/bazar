<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailWithOtp extends Notification # implements ShouldQueue
{
    // use Queueable;
    public $verificationCode;
    //use 'implements ShouldQueue' and in the body 'use Queueable' for mor perfomance
    /**
     * Create a new notification instance.
     */
    public function __construct(string $verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Verify Your Email Address')
                    ->line('Please use the following code to verify your email address:')
                    ->line('Your verification code is: **' . $this->verificationCode . '**')
                    ->line('This code is valid for 10 minutes.')
                    ->line('If you did not create an account, no further action is required.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}