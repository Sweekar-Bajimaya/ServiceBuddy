import { Rating, TextField, Button, Box, Typography } from "@mui/material";
import { useState } from "react";
import { submitReview } from "../../services/api";
import { useToast } from "./ToastProvider";

const ReviewForm = ({ booking, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0 || reviewText.trim() === "") {
      alert("Please provide a rating and feedback.");
      return;
    }

    setLoading(true);
    try {
      // Create review object matching your backend expectations
      const reviewData = {
        provider_id: booking.provider_id,
        rating: rating,
        review: reviewText,  // Changed from review_text
      };

      const response = await submitReview(reviewData);
      console.log("Review submitted:", response.data);
      showToast("Review submitted successfully!", "success");
      setSubmitted(true);
      onReviewSubmitted(); // Call the parent function to refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Failed to submit review. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Typography variant="body2" sx={{ mt: 2 }}>
        Thank you for your review!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="subtitle1">Leave a Review</Typography>
      <Rating
        name="rating"
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        sx={{ mb: 1 }}
      />
      <TextField
        label="Your feedback"
        multiline
        fullWidth
        rows={3}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;
