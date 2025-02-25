import React from "react";
import "../Footer/footer.css";

function Footer() {
  return (
    <div>
      <footer>
        <div className="footer-main">
          <div className="container">
            <div className="part-one">
              <div className="description">
                <div className="heading">
                  <h4>About Us</h4>
                </div>
                <p>
                  Welcome to UK Ezhava Matrimony, the premier matchmaking
                  platform dedicated to helping Ezhava community members living
                  in the UK find their perfect life partners.We understand the
                  importance of tradition, values, and cultural compatibility in
                  a marriage, and our platform is designed to bring together
                  like-minded individuals who share a common heritage.
                </p>
              </div>
            </div>

            <div className="part-two">
              <div className="help-support">
                <div className="heading">
                  <h4>Help and Support</h4>
                </div>
                <ul>
                  <li>
                    <p>24*7 Live Help</p>
                  </li>
                  <li>
                    <p>Contact Us</p>
                  </li>
                  
                </ul>
              </div>
            </div>

            <div className="part-three">
              <div className="office">
                <div className="heading">
                  <h4>Office</h4>
                </div>
                <ul>
                  <li>
                    <p>
                      SNDP Cambridge <br></br>
                      Cambridge, United Kingdom.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="part-four">
              <div className="contact-us">
                <div className="heading">
                  <h4>Contact Us</h4>
                </div>
                <ul>
                  <li>
                    <p>sndpcambridge@hotmail.co.uk</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* <div className="part-five">
              <div className="social-media">
                <div className="heading">
                  <h4>Social Media</h4>
                </div>
                <div className="image-container">
                  <div class="facebook">
                    <img src="" alt="" />
                  </div>
                  <div class="twitter"></div>
                  <div class="insta"></div>
                </div>
              </div>
            </div> */}
          </div>
          <div class="copy-right-footer">
            <p>Developed by Scipy Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
