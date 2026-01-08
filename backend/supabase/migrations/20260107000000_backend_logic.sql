-- Function to handle order payment and update stock
CREATE OR REPLACE FUNCTION public.handle_order_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to 'processing' (meaning payment was verified)
  IF (NEW.status = 'processing' AND (OLD.status IS NULL OR OLD.status = 'pending')) THEN
    -- Update stock for each item in the order
    UPDATE public.products p
    SET stock = p.stock - oi.quantity
    FROM public.order_items oi
    WHERE p.id = oi.product_id
    AND oi.order_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for order status updates
CREATE TRIGGER on_order_status_update
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_payment();

-- Function to get admin dashboard statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_revenue', COALESCE((SELECT SUM(total) FROM public.orders WHERE status IN ('processing', 'shipped', 'delivered')), 0),
    'active_users', (SELECT COUNT(*) FROM public.profiles),
    'total_products', (SELECT COUNT(*) FROM public.products),
    'new_orders', (SELECT COUNT(*) FROM public.orders WHERE status = 'pending' OR (status = 'processing' AND created_at > now() - interval '24 hours')),
    'revenue_change', '+12.5%', -- Placeholder for actual calculation
    'users_change', '+3.2%',
    'products_change', '0%',
    'orders_change', '-5.4%'
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for top selling products
CREATE OR REPLACE VIEW public.top_selling_products AS
SELECT 
  p.id,
  p.name,
  p.images,
  SUM(oi.quantity) as total_sales,
  SUM(oi.quantity * oi.price) as total_revenue
FROM public.products p
JOIN public.order_items oi ON p.id = oi.product_id
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status IN ('processing', 'shipped', 'delivered')
GROUP BY p.id, p.name, p.images
ORDER BY total_sales DESC
LIMIT 5;

-- Grant access to these to admins
CREATE POLICY "Admins can call get_admin_stats" ON public.profiles
  FOR SELECT USING (id = auth.uid() AND role = 'admin');

-- Ensure the view is public or restricted to admins
-- Views don't have RLS by default in the same way, but we can manage permissions
GRANT SELECT ON public.top_selling_products TO authenticated;
GRANT SELECT ON public.top_selling_products TO service_role;

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Subscribers policies
CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Contact messages policies
CREATE POLICY "Anyone can send a message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update messages" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Search function for products
CREATE OR REPLACE FUNCTION public.search_products(query TEXT)
RETURNS SETOF public.products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.products
  WHERE 
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || category) 
    @@ websearch_to_tsquery('english', query)
  ORDER BY 
    ts_rank(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || category), websearch_to_tsquery('english', query)) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
