
import React from 'react';
import { connect } from 'react-redux';

class PrivacyPolicy extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
      }

    render() {
        
        return (
            <React.Fragment>
              <div className="row my-5">
              <div className="col-md-12 mb-4"><h1>Privacy Policy</h1></div>
                  <div className="col-md-12" style={{ textAlign: "justify", textJustify: "inter-word"}}>
                      <div>
                        <p>
                        We appreciate the trust you place in KaBloom, and are committed to ensuring your privacy and the security of your personal information. Our privacy policy, updated June 30, 2006, describes the information we collect and how we use it. We always welcome your questions and feedback. For privacy-related issues, please contact us at customerservice@kabloomcorp.com .</p>
                      </div>
                      <div>
                        <span style={{ fontWeight: "bold" }}>Information We Collect </span>
                          {/* <span>  </span> */}

                          <p>We may collect information (including name, address, telephone number, email address, and, when necessary, credit card information) when you:</p>
                          <ul>
                              <li>Place an order from our website</li>
                              <li>Make a purchase at one of our retail stores</li>
                              <li>Return an item or make an exchange</li>
                              <li>Inquire about our services</li>
                              <li>Request a catalog</li>
                              <li>Receive a gift package</li>
                              <li>Create an account at KaBloom.com</li>
                              <li>Subscribe to our Email Newsletter for Preferred Customers</li>
                              <li>Enter a contest or sweepstakes</li>
                              <li>Are referred to us through a marketing promotion</li>
                              <li>Participate in a marketing survey, promotion, or event</li>
                          </ul>
                          <p>We maintain the data that you provide us, along with a record of your purchases, in a secure database. We also gather information about how visitors navigate through our website by using data gathered with "cookies" and/or other online tools such as "pixel tags." (See Cookies and Pixel Tags below for further information.)</p>
                      </div>
                      <div>
                          <span style={{ fontWeight: "bold" }}>Using Information We Collect </span>
                            {/* <span>Consumers visit our Customers’ websites and provide information via the Kabloom Pvt Ltd. enterprise solution that is needed to fulfill e-commerce transactions for products and services. Retailers who agree to participate in Kabloom Pvt Ltd.’s platform will receive limited information about Consumers only as needed to deliver those products and services. This limited information includes name, address, and contact information such as phone number or email for both the purchasers and the recipient’s</span>  */}
                            <p>We continuously strive to provide you with the best possible shopping experience and to fulfill your orders exactly as you've requested. In order to do this, we collect information that helps us to:</p>
                            <ul>
                                <li>Process and track your order</li>
                                <li>Provide the services you requested</li>
                                <li>Contact you about the status of an order</li>
                                <li>Send you promotional offers we believe will be of interest to you</li>
                                <li>Send you the KaBloom Email Newsletter, if requested</li>
                                <li>Identify your product and service preferences</li>
                                <li>Customize our communications to you</li>
                                <li>Provide information concerning product recalls or products you have purchased</li>
                                <li>Improve our merchandise selection and customer service</li>
                            </ul>
                      </div>
                      <div>
                          <span style={{ fontWeight: "bold" }}>Information We Share with Others </span>
                            {/* <span>
                            We do not collect personally identifiable information about you unless you voluntarily submit that information to us as described in this Privacy Policy. Your provision of your personally identifiable information to us is completely voluntary; it is not a statutory or contractual requirement.
                            </span> */}
                          <p>We contract with other companies to provide certain services, including credit card processing, shipping, email distribution, market research, and promotions management. We provide these companies with only the information they need to perform their services – we work closely with them to ensure that your privacy is respected and protected. These companies are prohibited by contract from using your information for their own marketing purposes or from sharing your information with anyone other than KaBloom.</p>
                          <p>On rare occasions, we may disclose specific information upon governmental request, in response to a court order, or when required by law to do so. We may also share information with companies assisting in fraud protection or investigation. We do not provide information to these agencies or companies for marketing or commercial purposes.</p>
                      </div>
                      <div>
                          <span style={{ fontWeight: "bold" }}>KaBloom Email and Other Communications </span>
                          {/* <div>
                              <p>
                               <span style={{ fontWeight: "bold" }}>User Information: </span>
                               <span> To facilitate our Services, we collect contact information such as name, date of birth, phone number, address, username, password, order history, company name, store manager contact information. </span>
                              </p>
                          </div> */}
                          <p>When you provide us your email address, we may send you emails necessary to process your order or to respond to a request. For example, after you place an order at KaBloom.com, you will receive an email confirmation and, in most cases, an email with package tracking information.</p>
                          <p>Additionally, if you have purchased from KaBloom or subscribed to one of our newsletters or otherwise have chosen to receive communications from us, we may occasionally update you on special opportunities via email or other methods.</p>
                          <p>You can choose to be removed from our mailing lists at any time by managing your subscription account at the following link: Manage Newsletter Subscription Account. You can also unsubscribe by using the link provided in each of our emails. As we only wish to send email to our opt-in customers and do not intentionally spam, please be certain that you have sent your unsubscribe request from the address you wish to be removed. If you have another email address you would like removed, please send another email from that address. Because we plan our mailings in advance, it may take several weeks for your request to become effective. If, due to human error, you continue to receive our communications, please contact us again and we will make every effort to correct the situation.</p>
                          <p>If you received an email from another company mentioning KaBloom and want to unsubscribe, please follow their unsubscribe procedures. If you have any questions or comments, please contact our Customer Care Center at customerservice@kabloomcorp.com or at 1-800-KaBloom. You also may contact us at the address below.</p>
                          <p>We may also contact you if you have entered one of our contests or sweepstakes. If you choose not to receive updates when you enter a contest or sweepstakes, your chances of winning will not be affected.</p>
                      </div>
                      <div>
                              {/* <p> */}
                              <span style={{ fontWeight: "bold" }}>Cookies and Pixel Tags</span>
                                {/* <span>We collect personal information such as email address, phone number, or mailing address when you request information about our Services, request customer or technical support, or otherwise communicate with us.</span> */}
                              {/* </p> */}
                              <p>A cookie is a small data file that is stored by your web browser on your computer. Cookies enable you to place an order on our website. They also allow us to enhance and personalize your online shopping experience so that the information you receive is more relevant to you.</p>
                              <p>For example, we use cookies to:</p>
                              <ul>
                                <li>Remember what items are in your shopping basket</li>
                                <li>Recognize you when you return to our website</li>
                                <li>Enable you to use stored information, if you have created an account</li>
                                <li>Study how our customers navigate through our website and which products they request in site searches</li>
                                <li>If you have set your browser to refuse cookies, please call us at 1-800-KaBloom if you wish to place an order.</li>
                              </ul>
                              <p>We also use pixel tags – tiny graphic images – to tell us what parts of our website you have visited, or to measure the effectiveness of any searches you may do on our site. Pixel tags may also enable us to send you email in a format you can read. They also let us know when you have opened an email message from us.</p>
                              <p>We may contract with other companies who use cookies or other online tools such as pixel tags to measure the performance of a marketing effort on our behalf. We prohibit these companies from using this information for their own marketing purposes or from sharing this information with anyone other than KaBloom.</p>
                      </div>
                      <div>
                              {/* <p>
                                <span style={{ fontWeight: "bold" }}>Interactive Features: </span>
                                <span>We may offer interactive features such as commenting functionalities, review forums, blogs, chat services, and social media pages. We and other individuals who use our Services may collect the information you submit or make available through these interactive features. Any information shared on the public sections of these channels will be considered “public” and may not be subject to the privacy protections referenced herein.</span>
                              </p> */}
                              <span style={{ fontWeight: "bold" }}>Links to Other Sites</span>
                              <p>Occasionally we provide links on our website to other sites we think you will enjoy. These sites operate independently of KaBloom and have established their own privacy and security policies. We have no control over other sites or their content and cannot guarantee, represent, or warrant that the content of these sites is accurate, legal and/or inoffensive. We do not endorse the content of other sites, and cannot warrant that these sites do not contain viruses or other features that may adversely affect your computer. For the best online experience, we strongly encourage you to review the policies at any site you visit.</p>
                      </div>
                      <div>
                              {/* <p>
                                <span style={{ fontWeight: "bold" }}>Non-Personal Or Aggregate Information: </span>
                                <span>When you visit or use the Site, we may automatically collect certain non-personally identifiable information about you. In addition, we may also aggregate information collected from our users. Non-personally identifiable information or aggregate information may be disclosed and/or used for our business purposes in accordance with applicable law.</span>
                              </p> */}
                               <span style={{ fontWeight: "bold" }}>Feedback </span>
                               <p>We welcome all comments, feedback, information, or materials ("feedback"), which you submit to us through or in conjunction with our site. Please note that feedback shall be considered non-confidential and become the property of KaBloom. By submitting feedback to us, you agree to a no-charge assignment to us of all rights, title, and interest in copyrights and other intellectual property rights on a worldwide basis to your feedback. We shall be free to use your feedback on an unrestricted basis.</p>
                      </div>
                      <div>
                             {/* <p>
                                <span style={{ fontWeight: "bold" }}>Cookies and Similar Technologies: </span>
                                <span>We, as well as third parties that provide content, advertising, or other functionality on the Services, may use cookies, pixel tags, local storage, and other technologies (“Technologies”) to automatically collect information through the Services. Technologies are essentially small data files placed on your computer, tablet, mobile phone, or other devices that allow us and our partners to record certain pieces of information whenever you visit or interact with our Services.</span>
                             </p> */}
                             <span style={{ fontWeight: "bold" }}>Updating or Reviewing Your Information</span>
                             <p>To update your customer information (name, address, telephone number, and email address), please visit the My Account area of this site. To protect your privacy, we will need to validate your identity (log in) before you can update or review your information.</p>
                             {/* <ul>
                                <li>
                                    <p><span style={{ fontWeight: "bold" }}> Cookies:  </span> 
                                    <span> Cookies are small text files placed in visitors’ computer browsers to store their preferences. Most browsers allow you to stop or restrict the placement of cookies and similar technologies on your device or flush them from your browser by adjusting your browser or device preferences, in which case you may still use our Site, albeit with limited functionality. Further information on cookies is available at <a href="https://www.allaboutcookies.org">www.allaboutcookies.org.</a>.</span>
                                    </p>
                                </li>
                                <li>
                                    <p><span style={{ fontWeight: "bold" }}>Pixel Tags/Web Beacons: </span>
                                        <span>A pixel tag (also known as a web beacon) is a piece of code embedded in the Services that collects information about users’ engagement on that web page. The use of a pixel allows us to record, for example, that a user has visited a particular web page or clicked on a particular advertisement.</span>
                                    </p>
                                </li>
                                <li>
                                    <p><span style={{ fontWeight: "bold" }}>Analytics: </span>
                                    <span>We may also use Google Analytics and other service providers to collect information regarding visitor behavior and visitor demographics on our Services. For more information about Google Analytics, please visit <a href="https://www.google.com/policies/privacy/partners/">www.google.com/policies/privacy/partners/</a>. You can opt out of Google’s collection and processing of data generated by your use of the Services by going to <a href="http://tools.google.com/dlpage/gaoptout">http://tools.google.com/dlpage/gaoptout</a>.</span></p>
                                </li>
                            </ul>   */}
                      </div>
                      <div>
                              {/* <p> <span style={{ fontWeight: "bold" }}>Information from Other Sources: </span> 
                                <span>We may obtain information about you from other sources, including through third party services and organizations to supplement information provided by you. For example, if you access our Services through a third-party application such as a third-party login service, we may collect information about you from that third-party application that you have made available via your privacy settings. This supplemental information allows us to verify information that you have provided to us and to provide you with the Services.</span>
                              </p> */}
                              <span style={{ fontWeight: "bold" }}>Privacy of Children on Our website</span>
                              <p>Our website is not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. In addition, we do not knowingly solicit data from children, nor do we knowingly market to children. KaBloom requires that children under the age of 18 use our service only in conjunction with their parents or guardians.</p>
                      </div>
                      <div>
                                {/* <p><span style={{ fontWeight: "bold" }}>HOW WE USE YOUR INFORMATION</span></p>
                                <p><span>We use information for a variety of business purposes, including to </span></p>
                                <p><span style={{ fontWeight: "bold" }}>Fulfil our contracts and provide our Services, such as:</span></p>
                                <ul>
                                    <li><span>Managing account information;</span></li>
                                    <li><span>Responding to questions, comments, and other requests;</span></li>
                                    <li><span>Providing access to certain areas, functionalities, and features of our Services;</span></li>
                                    <li><span>Communicating with you about your account, activities on our Services and policy changes; and</span></li>
                                    <li><span>Answering your requests for customer or technical support.</span></li>
                                </ul>
                                <span style={{ fontWeight: "bold" }}>
                                    Analyze and improve our Services pursuant to our legitimate interest, such as:</span>
                                <ul>
                                    <li><span>Measuring interest and engagement in our Services;</span></li>
                                    <li><span>Conducting research and development; </span></li>
                                    <li><span>Developing new products and Services;</span></li>
                                    <li><span>Ensuring internal quality control;</span></li>
                                    <li><span>Verifying your identity and preventing fraud;</span></li>
                                    <li><span>Detecting bugs or other software issues; </span></li>
                                    <li><span>Preventing potentially prohibited or illegal activities;</span></li>
                                    <li><span>Enforcing our Terms; and </span></li>
                                    <li><span>To comply with our legal obligations, protect your vital interest, or as may be required for the public good.</span></li>
                                </ul>
                                <p>
                                  <span style={{ fontWeight: "bold" }}>Use De-identified and Aggregated Information: </span>
                                  <span>We may use personal information and other data about you to create de-identified and aggregated information, such as de-identified demographic information, de-identified location information, information about the computer or device from which you access our Services, or other analyses we create.</span>
                                </p>
                            </div> */}
                            <span style={{ fontWeight: "bold" }}>Policy Changes</span>
                            <p>From time to time, we may use customer information for unanticipated uses not previously disclosed in our privacy notice. If our information practices change, we will post these changes on our website. We encourage you to review our privacy policy periodically.</p>
                      </div>
                      <div>
                          {/* <p><span style={{ fontWeight: "bold" }}>DISCLOSING YOUR INFORMATION TO THIRD PARTIES</span></p>
                            <p><span>We may share your personal information with the following categories of third parties:</span>
                          </p>
                        <div>
                            <p><span style={{ fontWeight: "bold" }}>Service Providers: </span>
                                <span>We may share any personal information we collect about you with our third-party service providers. The categories of service providers (processors) to whom we entrust personal information include: IT and related services; information and services you have requested; payment processors; customer service providers; and Retailers to support the provision of the Services. Service Providers receive limited personal information only as needed to deliver those products and services.</span>
                            </p>
                        </div>
                        <div>
                            <p><span style={{ fontWeight: "bold" }}>Brand Customers: </span>
                                <span>We provide your personal information to our Customer, a liquor brand, whose product you have purchased. Personal information may include contact information, order history, and fulfillment by retailers.
                                </span></p>
                        </div>
                        <div>
                            <p><span style={{ fontWeight: "bold" }}>Affiliates: </span>
                                <span>We may share personal information with our affiliated companies. </span>
                            </p>
                        </div>
                        <div>
                            <p><span style={{ fontWeight: "bold" }}>Advertising Partners: </span>
                                <span>Through our Services, we may allow third party advertising partners to set Technologies and other tracking tools to collect information regarding your activities and your device (e.g., your IP address, mobile identifiers, page(s) visited, location, time of day). We may also combine and share such information and other information (such as demographic information and past purchase history) with third party advertising partners. These advertising partners may use this information (and similar information collected from other websites) for purposes of delivering targeted advertisements to you when you visit third party websites within their networks. This practice is commonly referred to as “interest-based advertising” or “online behavioral advertising. We may allow access to other data collected by the Services to share information that may be useful, relevant, valuable or otherwise of interest to you.</span>
                            </p>
                            <p> 
                                <span>You may stop or restrict the placement of Technologies on your device or remove them by adjusting your preferences as your browser or device permits. The online advertising industry also provides websites from which you may opt out of receiving targeted ads from data partners and other advertising partners that participate in self-regulatory programs. You can access these and learn more about targeted advertising and Consumer choice and privacy, at  </span>
                                <a href="https://www.networkadvertising.org/managing/opt_out.asp">www.networkadvertising.org/managing/opt_out.asp</a>,<a href="http://www.youronlinechoices.eu/">http://www.youronlinechoices.eu/</a>,<a href="https://youradchoices.ca/choices/">https://youradchoices.ca/choices/</a>, and <a href="http://www.aboutads.info/choices/">www.aboutads.info/choices/</a>. To separately make choices for mobile apps on a mobile device, you can download DAA's AppChoices application from your device's app store. Alternatively, for some devices you may use your device's platform controls in your settings to exercise choice.
                            </p>
                            <p>Please note you must separately opt out in each browser and on each device. Advertisements on third party websites that contain the AdChoices link may have been directed to you based on information collected by advertising partners over time and across websites. These advertisements provide a mechanism to opt out of the advertising partners’ use of this information for interest-based advertising purposes.</p>
                        </div>
                        <div>
                            <p><span style={{ fontWeight: "bold" }}>Disclosures to Protect Us or Others: </span>
                                <span>We may access, preserve, and disclose any information we store associated with you to external parties if we, in good faith, believe doing so is required or appropriate to: comply with law enforcement or national security requests and legal process, such as a court order or subpoena; protect your, our or others’ rights, property, or safety; enforce our policies or contracts; collect amounts owed to us; or assist with an investigation or prosecution of suspected or actual illegal activity.</span>
                            </p>
                        </div>
                        <div>
                            <p><span style={{ fontWeight: "bold" }}>Disclosure in the Event of Merger, Sale, or Other Asset Transfers: </span>
                                <span> If we are involved in a merger, acquisition, financing due diligence, reorganization, bankruptcy, receivership, purchase or sale of assets, or transition of service to another provider, then your information may be sold or transferred as part of such a transaction, as permitted by law and/or contract.</span>
                            </p>
                        </div> */}
                        <span style={{ fontWeight: "bold" }}>Return and Refund Policy</span>
                        <p>All sales are final. You may be eligible for a replacement bouquet or a refund if the wrong item was delivered, delivered late, damaged, defective or the bouquet does not meet our 7-Day freshness guarantee. If you think you are eligible, please contact customer service at 1-(800) 552-5666 or customerservice@kabloomcorp.com. Replacement bouquets cannot be transferred for value or redeemed for cash.</p>
                      </div>
                      <div>
                            {/* <p><span style={{ fontWeight: "bold" }}>YOUR CHOICES</span></p>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>General: </span>
                                <span>You have certain choices about your personal information. Where you have consented to the processing of your personal information, you may withdraw that consent at any time and prevent further processing by contacting us as described below. Even if you opt out, we may still collect and use anonymous information regarding your activities on our Services and for other legal purposes as described above. </span>
                            </p>
                          </div>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>Communications with Us; Opting Out: </span>
                                <span>By providing your email address to us, you expressly consent to receive emails from us. We may use email to communicate with you, to send information that you have requested or to send information about other services provided by us, provided that, we will not give your email address to another party to promote their products or services directly to you without your consent or as set forth in this Privacy Policy. To opt-out of any future messages from us, you should send an unsubscribe request to us at <a href="mailto:contact@kabloom.com">contact@kabloom.com</a>. We will process your request within a reasonable time after receipt. However, we are not responsible for removing your personal information from the lists of any third party who has previously been provided with your information in accordance with this Privacy Policy or your consent. Please note that if you opt out in this manner, certain aspects of the Site may no longer be available to you. We process requests to be placed on do-not-mail, do-not-phone and do-not-contact lists as required by applicable law.</span>
                            </p>
                          </div>
                          <div>
                              <p><span style={{ fontWeight: "bold" }}>Do Not Track: </span>
                                 <span>Do Not Track (“DNT”) is a privacy preference that users can set in certain web browsers. Please note that we do not respond to or honor DNT signals or similar mechanisms transmitted by web browsers.</span> 
                              </p>
                          </div>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>Your Privacy Rights: </span>
                                <span>In accordance with applicable law, you may have the right to:</span>
                            </p>
                            <ul>
                                <li>request confirmation of whether we are processing your personal information;</li>
                                <li>obtain access to or a copy of your personal information;</li>
                                <li>receive an electronic copy of your personal information or ask us to send that information to another company;</li>
                                <li>restrict our uses of your personal information, including the right to opt in or opt out of the sale of your personal information to third parties, depending on applicable law;</li>
                                <li>seek correction or amendment of inaccurate, untrue, incomplete, or improperly processed personal information; and</li>
                                <li>request erasure of personal information held about you, subject to certain exceptions prescribed by law.</li>
                            </ul>
                            <p>
                              If you would like to exercise any of these rights, please contact us by email at <a href="mailto:contact@kabloom.com">contact@kabloom.com</a>. If you do not want your personal information shared with any third party who may use such information for direct marketing purposes, then you may opt out of such disclosures by sending an email to us at <a href="mailto:contact@kabloom.com">contact@kabloom.com</a>. We will process such requests in accordance with applicable laws. To protect your privacy, we will take steps to verify your identity before fulfilling your request.
                            </p>
                          </div>
                          <div>
                              <p><span style={{ fontWeight: "bold" }}>Security: </span>
                                <span>We have undertaken and will continue to undertake commercially reasonable efforts designed to prevent unauthorized access to user data retained in our servers. However, due to the inherent open nature of the Internet, we cannot ensure or warrant the security of any information provided online. Please note that we will not be liable for disclosures of your data due to errors or unauthorized acts of third parties. By using the Services or providing personal information to us, you agree that we may communicate with you electronically regarding security, privacy, and administrative issues relating to your use of the Services. If we learn of a security system’s breach, we may attempt to notify you electronically by posting a notice on the Services, by mail or by sending an e-mail to you.</span>
                              </p>
                          </div>
                          <div>
                              <p><span style={{ fontWeight: "bold" }}>Data Retention: </span>
                                <span>We store the personal information we receive as described in this Privacy Policy for as long as you use our Services or as necessary to fulfill the purpose(s) for which it was collected, provide our Services, resolve disputes, establish legal defenses, conduct audits, pursue legitimate business purposes, enforce our agreements, and comply with applicable laws.</span>
                              </p>
                          </div>
                          <div>
                              <p><span style={{ fontWeight: "bold" }}>Third Party Links: </span>
                                <span>The Site may contain links to other websites not maintained by us. We encourage you to be aware when you leave the Site and to read the terms and conditions and privacy statements of each and every website that you visit. We are not responsible for the practices or the content of such other websites or services. The existence of a link between the Site and any other website is not and shall not be understood to be an endorsement by us of the owner or proprietor of the linked internet website, nor an endorsement of us by the owner or proprietor of such linked website.</span>
                              </p>
                          </div>
                          <div>
                              <p><span style={{ fontWeight: "bold" }}>International Data Transfers: </span>
                                <span>Our Site is maintained in the United States of America. By using the Site, you freely and specifically give us your consent the transfer, processing, and storage of your personal information anywhere in the world, including but not limited to, the United States or other countries, which may have data protection laws that are different from the laws where you live. We have taken appropriate safeguards to require that your personal information will remain protected and require our third-party service providers and partners to have appropriate safeguards as well. You understand that data stored in the United States may be subject to lawful requests by the courts or law enforcement authorities in the United States.</span>
                              </p>
                          </div>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>Children’s Information: </span>
                                <span>The Services are not directed to children under 13 (or other age as required by local law), and we do not knowingly collect personal information from children. If you learn that your child has provided us with personal information without your consent, you may contact us as set forth below. If we learn that we have collected any personal information in violation of applicable law, we will promptly take steps to delete such information and terminate the child’s account.</span>
                            </p>
                          </div>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>Supervisory Authority: </span>
                                <span>If you are located in the European Economic Area, you have the right to lodge a complaint with a supervisory authority if you believe our processing of your personal information violates applicable law.</span>
                            </p>
                          </div>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>Changes to Privacy Policy: </span>
                                <span>We reserve the right, at our discretion, to change, modify, add, or remove portions from this Privacy Policy at any time. Your continued access of the Site after such changes conclusively demonstrates your acceptance of those changes.</span>
                            </p>
                          </div>
                          <div>
                            <p><span style={{ fontWeight: "bold" }}>Contact: </span>
                                <span>For questions or concerns relating to this Privacy Policy or your information, or if you wish to submit a request to exercise your rights as detailed in this policy, please contact our Data Protection Officer by email at <a href="mailto:contact@kabloom.com">contact@kabloom.com</a>.</span>
                            </p>
                          </div> */}

                          <span style={{ fontWeight: "bold" }}>Questions or Comments?</span>
                          <p>If you have any comments or questions, please do not hesitate to contact us at customerservice@kabloomcorp.com or at 1-800-KaBloom, or write us at:</p>
                          <p>
                          KaBloom.com, LTD <br></br>
                          305 Harvard Street <br></br>
                          Brookline, MA 02446
                          </p>
                          <p></p>
                          <p></p>
                     </div>
                  </div>
              </div>       
            </React.Fragment>
          );
     }
}

export default PrivacyPolicy;