import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { Review } from '@/lib/api';

// Mock reviews
const mockReviews: (Review & { productName: string })[] = [
  {
    id: '1',
    productId: 'prod-1',
    productName: 'Wireless Headphones Pro',
    userId: 'user-1',
    userName: 'John D.',
    rating: 5,
    title: 'Best headphones ever!',
    content: 'Amazing sound quality and super comfortable. Battery lasts forever. Highly recommend!',
    isVerifiedPurchase: true,
    isFeatured: true,
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    productId: 'prod-2',
    productName: 'USB-C Hub Premium',
    userId: 'user-2',
    userName: 'Sarah M.',
    rating: 4,
    title: 'Great product, minor issues',
    content: 'Works well for most things. USB ports are a bit tight but overall very happy with the purchase.',
    isVerifiedPurchase: true,
    isFeatured: false,
    createdAt: '2024-01-19T15:00:00Z',
  },
  {
    id: '3',
    productId: 'prod-1',
    productName: 'Wireless Headphones Pro',
    userId: 'user-3',
    userName: 'Mike R.',
    rating: 2,
    title: 'Not as expected',
    content: 'Sound is okay but the build quality feels cheap. Expected better for the price.',
    isVerifiedPurchase: false,
    isFeatured: false,
    createdAt: '2024-01-18T09:00:00Z',
  },
  {
    id: '4',
    productId: 'prod-3',
    productName: 'Bluetooth Speaker Mini',
    userId: 'user-4',
    userName: 'Emily C.',
    rating: 5,
    title: 'Perfect for travel',
    content: 'Compact, loud, and great battery. Takes everywhere with me now!',
    isVerifiedPurchase: true,
    isFeatured: false,
    createdAt: '2024-01-17T12:30:00Z',
  },
];

export default function AdminReviews() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState(mockReviews);

  const filteredReviews = reviews.filter(review =>
    review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFeature = (reviewId: string) => {
    setReviews(prev => prev.map(r =>
      r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r
    ));
    
    toast({
      title: 'Review updated',
      description: 'Review featured status has been changed.',
    });
  };

  const handleDelete = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    
    toast({
      title: 'Review deleted',
      description: 'The review has been removed.',
    });
  };

  const handleHide = (reviewId: string) => {
    toast({
      title: 'Review hidden',
      description: 'The review is now hidden from public view.',
    });
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
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.isFeatured).length}
              </div>
              <p className="text-sm text-muted-foreground">Featured</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.isVerifiedPurchase).length}
              </div>
              <p className="text-sm text-muted-foreground">Verified Purchases</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                          <p className="font-medium">{review.userName}</p>
                          {review.isVerifiedPurchase && (
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
                      {review.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
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
                            {review.isFeatured ? 'Unfeature' : 'Feature'}
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
