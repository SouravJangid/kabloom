// import React, { useState } from "react";
// import Container from "@material-ui/core/Container";
// import Button from "@material-ui/core/Button";
// import StarIcon from "@material-ui/icons/Star";
// import IconButton from "@material-ui/core/IconButton";
// import { CheckCircleOutline, HighlightOff, ChevronLeft, ChevronRight } from "@material-ui/icons";
// import Avatar from "@material-ui/core/Avatar";
// import StarHalfIcon from '@material-ui/icons/StarHalf'
// import Typography from "@material-ui/core/Typography";
// import './ReviewsComponent.scss';
// const reviewsData = {
//   "summaryText": "Customers find these flowers beautiful and consider them a wonderful gift, with good value for money. However, the quality receives mixed feedback, with some describing them as excellent while others find them disappointing. Moreover, the freshness and color variation are concerns, with reports of flowers arriving wilted and turning brown. Additionally, customers report issues with stem damage, noting broken stems and detached buds.",
//   "pros": [
//     "Beauty",
//     "Value for money",
//     "Gift value"
//   ],
//   "cons": [
//     "Wilt resistance",
//     "Stem damage"
//   ],
//   "neutral": [
//     "Quality",
//     "Color variation",
//     "Freshness"
//   ],
//   "images": [
//     "https://i.pinimg.com/736x/32/67/7d/32677d7f9531449e89f4bd2f6571b6e8.jpg",
//     "https://i.pinimg.com/736x/80/98/b3/8098b3294b80665bb424d485060d3307.jpg",
//     "https://i.pinimg.com/736x/4e/cb/93/4ecb93bb020bccf7c04fa94b2510cbec.jpg",
//     "https://i.pinimg.com/736x/0d/44/84/0d4484dedc340de9c805beddcf907185.jpg",
//     "https://i.pinimg.com/1200x/ce/ce/90/cece902bc6c62f5eef4527f95d2a1a0e.jpg"
//   ],
//   "overallRating": 3.7,
//   "totalRatings": 1266,
//   "breakdown": [
//     {
//       "stars": 5,
//       "percent": 59,
//       "count": 747
//     },
//     {
//       "stars": 4,
//       "percent": 7,
//       "count": 89
//     },
//     {
//       "stars": 3,
//       "percent": 7,
//       "count": 89
//     },
//     {
//       "stars": 2,
//       "percent": 7,
//       "count": 89
//     },
//     {
//       "stars": 1,
//       "percent": 20,
//       "count": 252
//     }
//   ],
//   "reviews": [
//     {
//       "id": 1,
//       "name": "John Prutzman",
//       "avatar": "",
//       "rating": 4,
//       "title": "2nd time gave the the benefit of doubts are beautiful!!!",
//       "date": "October 12, 2025",
//       "location": "United States",
//       "details": {
//         "color": "Purple",
//         "size": "12",
//         "style": "With Vase",
//         "verified": true
//       },
//       "text": "These were an anniversary gift to my wife. This is the 2nd time ordering from them. First time was a disaster. Gave them a 2nd try. Worse than the 1st. The originally said be delivered next day. Then it was 2nd day. That aside. They arrived. Wife opened them and they did not look good. She put them in water and the packet of flower food it comes with. The next morning they were beyond the point of no return. 1 day out the box and they are dead. At least last 2 days! But, no! The stems were cut right did no good. The case was the only thing that was good. The arrangement didn’t even look full. They came wilted. Sorry to say not giving them a 3rd try.",
//       "images": [
//         "https://i.pinimg.com/736x/32/67/7d/32677d7f9531449e89f4bd2f6571b6e8.jpg",
//         "https://i.pinimg.com/736x/80/98/b3/8098b3294b80665bb424d485060d3307.jpg",
//         "https://i.pinimg.com/736x/4e/cb/93/4ecb93bb020bccf7c04fa94b2510cbec.jpg",
//         "https://i.pinimg.com/736x/0d/44/84/0d4484dedc340de9c805beddcf907185.jpg",
//         "https://i.pinimg.com/1200x/ce/ce/90/cece902bc6c62f5eef4527f95d2a1a0e.jpg"
//       ]
//     },
//     {
//       "id": 2,
//       "name": "Cynthia Crowley",
//       "avatar": "",
//       "rating": 2,
//       "title": "The most disappointing experience",
//       "date": "October 23, 2025",
//       "location": "United States",
//       "details": {
//         "color": "Yellow",
//         "size": "12",
//         "style": "Without Vase",
//         "verified": true
//       },
//       "text": "Delivery was a day late.",
//       "images": []
//     }
//   ]
// }
// const ReviewsComponent = () => {
//   const data = reviewsData;
//   const [startIndex, setStartIndex] = useState(0);
//   const visibleCount = 4;
//   const handlePrev = () => {
//     setStartIndex((prev) => Math.max(prev - 1, 0));
//   };

//   const handleNext = () => {
//     setStartIndex((prev) =>
//       Math.min(prev + 1, data.images.length - visibleCount)
//     );
//   };

//   const visibleImages = data.images.slice(startIndex, startIndex + visibleCount);

//   return (
//     <Container className="reviews-root">
//       <div className="top">
//         <div className="left">
//           <div className="reviews-header">
//             <Typography variant="h5" className="reviews-title">Customer Reviews:</Typography>
//             <div />
//           </div>

//           <div className="overall-ratings">
//             <div className="overall-rating">
//               <div className="rating-stars">
//                 <StarIcon />
//                 <StarIcon />
//                 <StarIcon />
//                 <StarIcon />
//                 <StarHalfIcon />
//               </div>
//               <div className="rating-number">{data.overallRating.toFixed(1)}</div>
//               <div className="rating-out-of">out of 5</div>

//             </div>

//             <div>
//               <Typography className="reviews-sub">{data.totalRatings.toLocaleString()} global ratings</Typography>
//             </div>
//           </div>

//           <div className="breakdown">
//             {data.breakdown.map((item) => {
//               const pct = item.percent || 0;

//               return (
//                 <div className="break-item" key={item.stars}>
//                   <div className="break-stars">
//                     <Typography variant="body2">{item.stars} star</Typography>
//                   </div>

//                   <div className="break-bar" aria-hidden="true">
//                     <div
//                       className="break-fill"
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>

//                   <div className="break-percent">
//                     <Typography variant="body2">{pct}%</Typography>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <h2>Review this product</h2>
//           <p>Share your thoughts with other customers</p>

//           <div className="write-review">
//             <Button variant="outlined" className="mui-button">Write A Customer Review</Button>
//           </div>
//           <div className="hr"></div>
//         </div>
//         <div className="right">
//           <div className="hr"></div>
//           <div className="customer-summary">
//             <Typography variant="h6" className="summary-title">Customers Say</Typography>
//             <Typography className="summary-text">{data.summaryText}</Typography>

//             <Typography variant="body2" className="select-more">
//               Select to learn more
//             </Typography>

//             <div className="tags-container">
//               {data.pros.map((p) => (
//                 <div key={p} className="tag positive">
//                   <CheckCircleOutline fontSize="small" /> {p}
//                 </div>
//               ))}
//               {data.cons.map((c) => (
//                 <div key={c} className="tag negative">
//                   <HighlightOff fontSize="small" /> {c}
//                 </div>
//               ))}
//               {data.neutral.map((n) => (
//                 <div key={n} className="tag neutral">
//                   {n}
//                 </div>
//               ))}
//             </div>
//             <hr />
//             <div className="reviews-images-section">
//               <div className="reviews-images-header">
//                 <Typography variant="h6">Reviews With Images</Typography>
//                 <Typography className="see-all">See all photos &gt;</Typography>
//               </div>

//               <div className="image-carousel">
//                 <IconButton onClick={handlePrev} disabled={startIndex === 0}>
//                   <ChevronLeft />
//                 </IconButton>

//                 <div className="image-list">
//                   {visibleImages.map((src, i) => (
//                     <div key={i} className="image-item">
//                       <img src={src} alt={`review-${i}`} />
//                     </div>
//                   ))}
//                 </div>

//                 <IconButton
//                   onClick={handleNext}
//                   disabled={startIndex + visibleCount >= data.images.length}
//                 >
//                   <ChevronRight />
//                 </IconButton>
//               </div>
//             </div>
//           </div>
//           <div className="hr"></div>
//           <h3>Top reviews from the United States</h3>
//           <div className="review-comments">
//             {data.reviews.map((rev) => (
//               <div key={rev.id} className="review-card">
//                 <div className="review-header">
//                   <Avatar src={rev.avatar} alt={rev.name} className="review-avatar" />
//                   <div>
//                     <Typography className="reviewer-name">{rev.name}</Typography>
//                     <div className="review-rating">
//                       {[...Array(5)].map((_, i) => (
//                         <StarIcon
//                           key={i}
//                           className={`star ${i < rev.rating ? "filled" : ""}`}
//                         />
//                       ))}
//                     </div>
//                     <Typography variant="subtitle1" className="review-title">
//                       {rev.title}
//                     </Typography>
//                   </div>
//                 </div>

//                 <Typography className="review-meta">
//                   Reviewed in the {rev.location.toLowerCase()} on {rev.date} <br />
//                   color <b>{rev.details.color}</b> | size <b>{rev.details.size}</b> |
//                   style <b>{rev.details.style}</b> |
//                   {rev.details.verified && (
//                     <span className="verified"> Verified Purchase</span>
//                   )}
//                 </Typography>

//                 <Typography className="review-text">{rev.text}</Typography>

//                 {rev.images && rev.images.length > 0 && (
//                   <div className="review-images">
//                     {rev.images.map((img, i) => (
//                       <img key={i} src={img} alt={`review-${i}`} />
//                     ))}
//                   </div>
//                 )}

//                 <div className="review-actions">
//                   <Button variant="outlined" className="action-btn">
//                     Helpful
//                   </Button>
//                   <Typography variant="body2" className="divider">
//                     |
//                   </Typography>
//                   <Button variant="text" className="action-btn text">
//                     Report
//                   </Button>
//                 </div>
//               </div>
//             ))}

//             <Typography className="see-more">See more reviews &gt;</Typography>
//           </div>
//         </div>
//       </div>
//       {/* <div className="bottom">
//         <div className="signin-container">
//           <h2 className="signin-title">See personalized recommendations</h2>
//           <button className="signin-button">Sign in</button>
//           <div className="top-text">▲<br />Top of page</div>
//         </div>
//         <div className="hr"></div>
//       </div> */}
//     </Container>
//   );
// };

// export default ReviewsComponent;
import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import StarIcon from "@material-ui/icons/Star";
import IconButton from "@material-ui/core/IconButton";
import { CheckCircleOutline, HighlightOff, ChevronLeft, ChevronRight } from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import StarHalfIcon from '@material-ui/icons/StarHalf';
import Typography from "@material-ui/core/Typography";
import { get as _get } from "lodash";
import './ReviewsComponent.scss';

// Mock summary (keep your design)
const mockSummary = {
  summaryText: "Customers find these flowers beautiful and consider them a wonderful gift, with good value for money. However, the quality receives mixed feedback, with some describing them as excellent while others find them disappointing. Moreover, the freshness and color variation are concerns, with reports of flowers arriving wilted and turning brown. Additionally, customers report issues with stem damage, noting broken stems and detached buds.",
  pros: ["Beauty", "Value for money", "Gift value"],
  cons: ["Wilt resistance", "Stem damage"],
  neutral: ["Quality", "Color variation", "Freshness"],
  images: [
    "https://i.pinimg.com/736x/32/67/7d/32677d7f9531449e89f4bd2f6571b6e8.jpg",
    "https://i.pinimg.com/736x/80/98/b3/8098b3294b80665bb424d485060d3307.jpg",
    "https://i.pinimg.com/736x/4e/cb/93/4ecb93bb020bccf7c04fa94b2510cbec.jpg",
    "https://i.pinimg.com/736x/0d/44/84/0d4484dedc340de9c805beddcf907185.jpg",
    "https://i.pinimg.com/1200x/ce/ce/90/cece902bc6c62f5eef4527f95d2a1a0e.jpg"
  ],
  overallRating: 3.7,
  totalRatings: 1266,
  breakdown: [
    { stars: 5, percent: 59, count: 747 },
    { stars: 4, percent: 7, count: 89 },
    { stars: 3, percent: 7, count: 89 },
    { stars: 2, percent: 7, count: 89 },
    { stars: 1, percent: 20, count: 252 }
  ]
};

const ReviewsComponent = ({ selectedChild }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  // Extract real reviews from selectedChild
  const realReviews = Array.isArray(_get(selectedChild, 'reviews.reviews', []))
    ? _get(selectedChild, 'reviews.reviews', [])
    : [];

  // Use real rating if available, else mock
  const realRatingSummary = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
  const realReviewCount = parseInt(_get(selectedChild, 'reviews.review_count', '0').replace(/[^0-9]/g, ''), 10) || 0;
  const overallRating = realRatingSummary > 0 ? (realRatingSummary / 20).toFixed(1) : mockSummary.overallRating.toFixed(1);
  const totalRatings = realReviewCount > 0 ? realReviewCount : mockSummary.totalRatings;

  const handlePrev = () => setStartIndex(prev => Math.max(prev - 1, 0));
  const handleNext = () => setStartIndex(prev => Math.min(prev + 1, mockSummary.images.length - visibleCount));
  const visibleImages = mockSummary.images.slice(startIndex, startIndex + visibleCount);
  const calculateBreakdown = (reviews) => {
    const total = reviews.length;
    if (total === 0) return mockSummary.breakdown;

    const counts = reviews.reduce((acc, rev) => {
      const rating = parseInt(rev.rating || 0, 10);
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    return [5, 4, 3, 2, 1].map(stars => {
      const count = counts[stars] || 0;
      const percent = Math.round((count / total) * 100);
      return { stars, percent, count };
    });
  };

  return (
    <Container className="reviews-root">
      <div className="top">
        <div className="left">
          <div className="reviews-header">
            <Typography variant="h5" className="reviews-title">Customer Reviews:</Typography>
          </div>

          {/* === OVERALL RATING === */}
          <div className="overall-ratings">
            <div className="overall-rating">
              <div className="rating-stars">
                {(() => {
                  const rating = parseFloat(overallRating);
                  return [...Array(5)].map((_, i) => {
                    if (i < Math.floor(rating)) return <StarIcon key={i} />;
                    if (i === Math.floor(rating) && rating % 1 >= 0.5) return <StarHalfIcon key={i} />;
                    return null;
                  });
                })()}
              </div>
              <div className="rating-number">{overallRating}</div>
              <div className="rating-out-of">out of 5</div>
            </div>
            <div>
              <Typography className="reviews-sub">
                {totalRatings.toLocaleString()} global rating{totalRatings !== 1 ? 's' : ''}
              </Typography>
            </div>
          </div>

          {/* === RATING BREAKDOWN === */}
          <div className="breakdown">
            {(() => {
              // Use real breakdown if available, else mock
              const breakdown = realReviews.length > 0
                ? calculateBreakdown(realReviews)
                : mockSummary.breakdown;

              return breakdown.map((item) => (
                <div className="break-item" key={item.stars}>
                  <div className="break-stars">
                    <Typography variant="body2">{item.stars} star</Typography>
                  </div>
                  <div className="break-bar">
                    <div className="break-fill" style={{ width: `${item.percent}%` }} />
                  </div>
                  <div className="break-percent">
                    <Typography variant="body2">{item.percent}%</Typography>
                  </div>
                </div>
              ));
            })()}
          </div>

          <h2>Review this product</h2>
          <p>Share your thoughts with other customers</p>
          <div className="write-review">
            <Button variant="outlined" className="mui-button">Write A Customer Review</Button>
          </div>
          <div className="hr"></div>
        </div>

        <div className="right">
          <div className="hr"></div>
          <div className="customer-summary">
            <Typography variant="h6" className="summary-title">Customers Say</Typography>
            <Typography className="summary-text">{mockSummary.summaryText}</Typography>
            <Typography variant="body2" className="select-more">Select to learn more</Typography>

            <div className="tags-container">
              {mockSummary.pros.map((p) => (
                <div key={p} className="tag positive">
                  <CheckCircleOutline fontSize="small" /> {p}
                </div>
              ))}
              {mockSummary.cons.map((c) => (
                <div key={c} className="tag negative">
                  <HighlightOff fontSize="small" /> {c}
                </div>
              ))}
              {mockSummary.neutral.map((n) => (
                <div key={n} className="tag neutral">{n}</div>
              ))}
            </div>

            <hr />
            <div className="reviews-images-section">
              <div className="reviews-images-header">
                <Typography variant="h6">Reviews With Images</Typography>
                <Typography className="see-all">See all photos &gt;</Typography>
              </div>

              <div className="image-carousel">
                <IconButton onClick={handlePrev} disabled={startIndex === 0}>
                  <ChevronLeft />
                </IconButton>
                <div className="image-list">
                  {visibleImages.map((src, i) => (
                    <div key={i} className="image-item">
                      <img src={src} alt={`review-${i}`} />
                    </div>
                  ))}
                </div>
                <IconButton onClick={handleNext} disabled={startIndex + visibleCount >= mockSummary.images.length}>
                  <ChevronRight />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="hr"></div>
          <h3>Top reviews from the United States</h3>
          <div className="review-comments">
            {realReviews.length > 0 ? (
              realReviews.map((rev) => (
                <div key={rev.id || rev.title} className="review-card">
                  <div className="review-header">
                    <Avatar src={rev.avatar || ''} alt={rev.nickname || 'User'} className="review-avatar" />
                    <div>
                      <Typography className="reviewer-name">{rev.nickname || 'Anonymous'}</Typography>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`star ${i < (rev.rating || 0) ? "filled" : ""}`}
                          />
                        ))}
                      </div>
                      <Typography variant="subtitle1" className="review-title">
                        {rev.title || 'No title'}
                      </Typography>
                    </div>
                  </div>

                  <Typography className="review-meta">
                    Reviewed in the United States on {rev.created_at || 'Unknown date'}
                    {rev.verified && <span className="verified"> Verified Purchase</span>}
                  </Typography>

                  <Typography className="review-text">{rev.detail || 'No review text.'}</Typography>

                  {rev.images && rev.images.length > 0 && (
                    <div className="review-images">
                      {rev.images.map((img, i) => (
                        <img key={i} src={img} alt={`review-${i}`} />
                      ))}
                    </div>
                  )}

                  <div className="review-actions">
                    <Button variant="outlined" className="action-btn">Helpful</Button>
                    <Typography variant="body2" className="divider">|</Typography>
                    <Button variant="text" className="action-btn text">Report</Button>
                  </div>
                </div>
              ))
            ) : (
              <Typography className="no-reviews">No customer reviews yet.</Typography>
            )}

            <Typography className="see-more">See more reviews &gt;</Typography>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReviewsComponent;