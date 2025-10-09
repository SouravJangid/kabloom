
import React from 'react';
import { connect } from 'react-redux';

class TermsConditionComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
      }

    render() {
        
        return (
            <React.Fragment>
              <div className="row  my-5">
              <div className="col-md-12 mb-4"><h1>Terms & Conditions</h1></div>
                  <div className="col-md-12" style={{ textAlign: "justify", textJustify: "inter-word"}}>
                      <div style={{ marginTop: 20 }}>
                        <p>
                        Welcome to kabloom.com (“Site”), a website maintained and operated by Kabloom Pvt Ltd. (“Company”, “we”, “our” or “us”).
                        </p>
                      </div>
                      <div style={{ marginTop: 20, textTransform: "uppercase" }}>
                          <p>
                          YOUR ACCESS TO AND USE OF THE WEBSITE IS SUBJECT TO THE FOLLOWING TERMS AND CONDITIONS ("TERMS AND CONDITIONS") AND ALL APPLICABLE LAWS. BY ACCESSING OR USING ANY PART OF THE WEBSITE, YOU ACCEPT, WITHOUT LIMITATION OR QUALIFICATION, THESE TERMS AND CONDITIONS. IF YOU DO NOT AGREE WITH ALL OF THE TERMS AND CONDITIONS SET FORTH BELOW, YOU MAY NOT USE ANY PORTION OF THE WEBSITE. THESE TERMS AND CONDITIONS CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION WAIVER. PLEASE READ THEM CAREFULLY, SINCE THEY AFFECT YOUR LEGAL RIGHTS.
                          </p>
                      </div>
                      <div style={{ marginTop: 20 }}>
                          <p>
                            <span style={{ fontWeight: "bold"}}>Use of Site: </span>This Site is provided for your personal and non-commercial use and for informational purposes only. Any other use of the Site requires the prior written consent of Company. You may not use spiders, robots, data mining techniques or other automated devices or programs to catalog, download or otherwise reproduce, store or distribute content available on the Site. Further, you may not use any such automated means to manipulate the Site, such as automating what are otherwise manual or one-off procedures. You may not take any action to interfere with, or disrupt, the Site or any other person's use of the Site, including, without limitation, via means of overloading, “flooding,” “mailbombing” or “crashing” the Site, circumventing security or user authentication measures or attempting to exceed the limited authorization and access granted to you under these Terms and Conditions. You may not frame portions of the Site within another Site. You may not resell use of, or access to, the Site to any third party without our prior written consent.
                          </p>
                      </div>
                      <div style={{ marginTop: 20 }}>
                          <p>
                          <span style={{ fontWeight: "bold"}}>Proprietary Rights: </span>Company is the owner of or otherwise licensed to use all parts of the Site, including all copy, software, graphics, designs and all patents, copyrights, trademarks, service marks, trade names, logos, and other intellectual property or proprietary rights contained therein. By using the Site, you agree not to copy, distribute, modify or make derivative works of any materials on the Site without the prior written consent of the owner of such materials. Except as expressly set forth in these Terms and Conditions, no license is granted to you and no rights are conveyed by virtue of accessing or using the Site. All rights not granted under these Terms and Conditions are reserved by Company. We do not accept any unsolicited ideas from outside the Company including without limitation suggestions about additions to our services or changes in methods of doing business. We may already be working on or may in the future work on a similar idea. This policy eliminates concerns about ownership of such ideas. If, notwithstanding this policy, you submit an unsolicited idea to this Site, you understand and acknowledge that such idea is not submitted in confidence and we assume no obligation, expressed or implied, by considering it. You further understand that we shall exclusively own all known or hereafter existing rights to the idea everywhere in the world, and that such idea is hereby irrevocably assigned to us on its creation. Without limiting the foregoing, to the extent any such assignment is deemed unenforceable, and/or to the extent necessary for Company to utilize your submission, you hereby grant Company an irrevocable, perpetual, worldwide license to use the idea and any associated intellectual property in any manner, in any medium now known or hereafter developed and without compensation to you.
                          </p>
                      </div>
                      <div style={{ marginTop: 20 }}>
                            <p>
                                <span style={{ fontWeight: "bold" }}>No Warranties: </span>
                                <span style={{ textTransform: "uppercase" }}>
                                WHILE COMPANY USES REASONABLE EFFORTS TO INCLUDE UP-TO- DATE INFORMATION ON THE WEBSITE, EXCEPT FOR THE EXPRESS WARRANTIES STATED IN THESE TERMS AND CONDITIONS, COMPANY MAKES NO WARRANTIES OR REPRESENTATIONS AS TO THE ACCURACY OR COMPLETENESS OF INFORMATION ON THE WEBSITE. TO THE FULLEST EXTENT PERMITTED BY LAW, YOUR USE OF THE WEBSITE IS AT YOUR OWN RISK. THE WEBSITE, INCLUDING ALL CONTENT MADE AVAILABLE ON OR ACCESSED THROUGH THE WEBSITE, IS PROVIDED "AS IS" AND COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND WHATSOEVER REGARDING THE CONTENT ON THE WEBSITE. FURTHER, TO THE FULLEST EXTENT PERMISSIBLE BY LAW, COMPANY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, NON-INFRINGEMENT, TITLE, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. COMPANY DOES NOT WARRANT THAT THE FUNCTIONS CONTAINED IN THE WEBSITE OR ANY MATERIALS OR CONTENT CONTAINED THEREIN WILL BE UNINTERRUPTED OR ERROR FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE WEBSITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. TO THE FULLEST EXTENT PERMITTED BY LAW, COMPANY SHALL NOT BE LIABLE FOR THE USE OF THE WEBSITE, INCLUDING, WITHOUT LIMITATION, THE CONTENT AND ANY ERRORS CONTAINED THEREIN. IN NO EVENT WILL COMPANY BE LIABLE UNDER ANY THEORY OF TORT, CONTRACT, STRICT LIABILITY OR OTHER LEGAL OR EQUITABLE THEORY FOR ANY LOST PROFITS, LOST DATA, LOST OPPORTUNITIES, COSTS OF COVER, EXEMPLARY, PUNITIVE, PERSONAL INJURY/WRONGFUL DEATH, SPECIAL, INCIDENTAL, INDIRECT OR OTHER CONSEQUENTIAL DAMAGES. FURTHER, TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL COMPANY BE LIABLE FOR ANY DIRECT DAMAGES EXCEEDING THE ONE HUNDRED INDIAN RUPEES.
                                </span>
                            </p>
                      </div>
                      <div style={{ marginTop: 20 }}>
                            <p>
                                <span style={{ fontWeight: 'bold'}}>Indemnification: </span>You agree to indemnify, defend and hold harmless Company, its employees, directors, officers, agents, business partners, advisors, investors, affiliates, contractors, distribution partners and representatives from and against any and all claims, demands, liabilities, costs or expenses, including attorney’s fees and costs, arising from, or related to (i) your use of the Site, (ii) any breach by you of any of these Terms and Conditions or (iii) any violation of applicable law.
                            </p>

                      </div>
                        <div style={{ marginTop: 20 }}>
                            <p>
                                <span style={{ fontWeight: 'bold' }}>Governing Law; Dispute Resolution; Arbitration: </span>
                                The laws of the State of Rajasthan shall govern these Terms and Conditions. While we will make reasonable efforts to resolve any disagreements you may have with Company, if these efforts fail you agree that all claims, disputes or controversies against Company arising out of these Terms and Conditions, or the purchase of any products or services ("Claim") are subject to fixed and binding arbitration (except for matters that may be taken to small claims court), no matter what legal theory they are based on or what remedy (damages, or injunctive or declaratory relief) they seek. This includes Claims based on contract, tort (including intentional tort), fraud, agency, your or our negligence, statutory or regulatory provisions, or any other sources of law; Claims made as counterclaims, cross-claims, third- party claims, interpleaders or otherwise; and Claims made independently or with other claims. You shall not be entitled to join or consolidate Claims in arbitration by or against other users or to arbitrate any Claim as a representative or member of a class or in a private attorney general capacity. 
                            </p>
                            <p>
                            A single, neutral arbitrator will resolve Claims. The arbitrator will be either a lawyer with at least ten (10) years’ experience or a retired or former judge appointed by the Company. The arbitration will follow the procedures and rules which are in effect on the date the arbitration is filed unless those procedures and rules are inconsistent with these Terms and Conditions, in which case these Terms and Conditions will prevail. Those procedures and rules may limit the discovery available to you or us. The arbitrator will take reasonable steps to protect your customer account information and other confidential information if requested to do so by you or us. Each party to the arbitration will bear the expense of that party's attorneys, experts, and witnesses, and other expenses, regardless of which party prevails, but a party may recover any or all expenses from another party if the arbitrator, applying applicable law, so determines. The arbitrator's award is final and binding on the parties unless we or you appeal it in writing to the arbitration firm within fifteen (15) days of notice of the award. The appeal must request a new arbitration before a panel of three neutral arbitrators designated by the Company. An award by a panel is final and binding on the parties after fifteen (15) days has passed. Any Claim you have must be commenced within one (1) year after the date the Claim arises. As noted above, you and Company hereby voluntarily and knowingly waive any right either may have to a court trial. We will not choose to arbitrate any Claim you bring in small claims court. However, if such a Claim is transferred, removed or appealed to a different court, we may then choose to arbitrate.
                            </p>

                        </div>
                        <div style={{ marginTop: 20}}>
                            <p>
                                <span style={{ fontWeight: 'bold'}}>Class Action Waiver: </span>
                                <span style={{ textTransform: "uppercase" }}>
                                YOU AGREE THAT, BY ENTERING INTO THIS AGREEMENT, YOU AND COMPANY ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS ACTION, COLLECTIVE ACTION, PRIVATE ATTORNEY GENERAL ACTION, OR OTHER REPRESENTATIVE PROCEEDING OF ANY KIND. CLAIMS AND REMEDIES SOUGHT AS PART OF A CLASS ACTION, PRIVATE ATTORNEY GENERAL OR OTHER REPRESENTATIVE ACTION ARE SUBJECT TO ARBITRATION ONLY ON AN INDIVIDUAL (NON-CLASS, NON- REPRESENTATIVE) BASIS, AND THE ARBITRATOR MAY AWARD RELIEF ONLY ON AN INDIVIDUAL (NON-CLASS, NON-REPRESENTATIVE) BASIS.
                                </span>
                            </p>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p>
                                <span style={{ fontWeight: 'bold'}}>Changes: </span>All information posted on the Site is subject to change without notice. In addition, these Terms and Conditions may be changed at any time without prior notice. We will make such changes by posting them on the Site. You should check the Site for such changes frequently. Your continued access of the Site after such changes conclusively demonstrates your acceptance of those changes.
                            </p>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <p>
                                <span style={{ fontWeight: 'bold'}}>Privacy Policy: </span>Use of the Site is also governed by our Privacy Policy, which is incorporated herein by reference.
                            </p>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p>
                                <span style={{ fontWeight: 'bold'}}>Questions: </span>Should you have any questions regarding these Terms and Conditions contact us at <a href="mailto:contact@kabloom.com">contact@kabloom.com</a>
                            </p>
                        </div>

                    </div>
                </div>       
            </React.Fragment>
          );
     }
}

export default TermsConditionComponent;