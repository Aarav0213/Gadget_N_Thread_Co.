import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StarRating } from '@/components/products/StarRating';
import { useToast } from '@/hooks/use-toast';
import { Search, MoreHorizontal, Star, Trash2, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/api';
import type { Review } from '@/lib/api';

interface ReviewWithMeta extends Review {
  productName: string;
  is_featured?: boolean;
}

export default function AdminReviews() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<ReviewWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('reviews')
        .select('*, product:products(name)')
        .order('created_at', { ascending: false });
      
      const mapped: ReviewWithMeta[] = (data || []).map((r: any) => ({
        ...r,
        productName: r.product?.name || 'Unknown Product',
        is_featured: r.is_featured || false,
      }));
      setReviews(mapped);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (review.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFeature = async (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    try {
      await supabase
        .from('reviews')
        .update({ is_featured: !review.is_featured })
        .eq('id', reviewId);
      
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, is_featured: !r.is_featured } : r
      ));
      
      toast({
        title: 'Review updated',
        description: 'Review featured status has been changed.',
      });
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await supabase.from('reviews').delete().eq('id', reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      
      toast({
        title: 'Review deleted',
        description: 'The review has been removed.',
      });
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleHide = async (reviewId: string) => {
    try {
      await supabase
        .from('reviews')
        .update({ is_active: false })
        .eq('id', reviewId);
      
      toast({
        title: 'Review hidden',
        description: 'The review is now hidden from public view.',
      });
      loadReviews();
    } catch (error) {
      console.error('Failed to hide review:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Moderate customer reviews</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{reviews.length}</div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0'}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.is_featured).length}
              </div>
              <p className="text-sm text-muted-foreground">Featured</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.is_verified_purchase).length}
              </div>
              <p className="text-sm text-muted-foreground">Verified Purchases</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading reviews...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{review.user_name || 'Anonymous'}</p>
                            {review.is_verified_purchase && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          {review.title && (
                            <p className="font-medium text-sm">{review.title}</p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {review.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{review.productName}</TableCell>
                      <TableCell>
                        <StarRating rating={review.rating} size="sm" />
                      </TableCell>
                      <TableCell>
                        {review.is_featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFeature(review.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              {review.is_featured ? 'Unfeature' : 'Feature'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleHide(review.id)}>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(review.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
