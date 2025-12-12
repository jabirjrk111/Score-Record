import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-600",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-10 py-2 px-4 text-sm",
        lg: "h-11 px-8 text-base"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        />
    );
};
