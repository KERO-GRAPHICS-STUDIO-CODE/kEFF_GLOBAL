-- Create a function to get merit-ranked listings
CREATE OR REPLACE FUNCTION get_ranked_listings()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  base_price NUMERIC,
  seller_id UUID,
  sales_volume INT,
  product_rating NUMERIC,
  review_count INT,
  seller_reputation NUMERIC,
  organic_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.description,
    p.base_price,
    p.seller_id,
    COALESCE(s.sales_volume, 0) as sales_volume,
    COALESCE(pr.avg_rating, 0) as product_rating,
    COALESCE(pr.review_count, 0) as review_count,
    COALESCE(sr.reputation, 0) as seller_reputation,
    -- Composite Score Formula:
    -- 40% Product Rating (scaled to 100, max 5 * 20 = 100)
    -- 30% Seller Reputation (scaled to 100, max 5 * 20 = 100)
    -- 15% Product Sales Volume (log scaled to prevent runaway scores)
    -- 15% Review Count Volume (log scaled to prevent runaway scores)
    (
      (COALESCE(pr.avg_rating, 0) * 20 * 0.40) +
      (COALESCE(sr.reputation, 0) * 20 * 0.30) +
      (CASE WHEN COALESCE(s.sales_volume, 0) > 0 THEN LOG(COALESCE(s.sales_volume, 0) + 1) * 10 * 0.15 ELSE 0 END) +
      (CASE WHEN COALESCE(pr.review_count, 0) > 0 THEN LOG(COALESCE(pr.review_count, 0) + 1) * 10 * 0.15 ELSE 0 END)
    ) AS organic_score
  FROM
    products p
  LEFT JOIN
    (SELECT product_id, COUNT(*) as sales_volume FROM orders WHERE status = 'Completed' GROUP BY product_id) s ON p.id = s.product_id
  LEFT JOIN
    (SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count FROM product_reviews GROUP BY product_id) pr ON p.id = pr.product_id
  LEFT JOIN
    (SELECT id as seller_id, avg_rating as reputation FROM user_profiles) sr ON p.seller_id = sr.seller_id
  WHERE
    p.is_active = true
  ORDER BY
    organic_score DESC;
END;
$$ LANGUAGE plpgsql;
