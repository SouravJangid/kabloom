import React from 'react';
import '../../assets/stylesheets/reviews.css';

function Reviews({ reviews }) {
  if (!reviews || !reviews.length) return <div className="no-reviews">No reviews available.</div>;

  return (
    <>
      <h2 className="reviews-title">Reviews</h2>
      <div className="reviews-count">{reviews.length} Reviews</div>
      <div className="reviews-list">
        {reviews.map((review, idx) => (
          <div className="review" key={idx}>
            <div className="review-header">
              <span className="reviewer-name"><strong>{review.reviewed_by}</strong></span>
              <span className="review-date"> | {review.posted_on}</span>
            </div>
            <div className="review-stars">{'★'.repeat(review.vendor_quality || 0)}</div>
            <div className="review-detail">{review.detail}</div>
            {review.florist_response && (
              <div className="review-response">
                <div className="response-label">Florist's Response:</div>
                <div>{review.florist_response}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Reviews;
