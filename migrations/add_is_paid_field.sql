-- Migration: Add is_paid field to orders table
-- Description: Adds a boolean field to track payment status and a payment_method field

-- Add is_paid column (defaults to false for existing orders)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;

-- Add payment_method column (nullable, stores 'efectivo' or 'tarjeta')
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20);

-- Update existing orders: if status is 'pagado', set is_paid to true
UPDATE orders 
SET is_paid = true 
WHERE status = 'pagado' AND is_paid = false;

-- Add comment to columns for documentation
COMMENT ON COLUMN orders.is_paid IS 'Indicates if the order has been paid (true) or not (false)';
COMMENT ON COLUMN orders.payment_method IS 'Payment method used: efectivo (cash/bar) or tarjeta (card)';
