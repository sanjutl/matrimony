import React, { useEffect, useState, useRef } from "react";
import DashStyles from "./dashboard.module.css";
import {
  Pen,
  Heart,
  Gear,
  Question,
  ShieldCheck,
  Shield,
  HeartStraight,
  Headset,
  Users,
  Crown,
  User,
  SignOut,
} from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
// import image from "../../assets/free-photo-of-couple-in-green-grass-field.jpeg";
import Nav from "../../component/Navbar/Nav";
import Footer from "../../component/Footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { clearUser } from "../../features/slice";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import baseUrl from "../../baseUrl";


function Dashboard() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const token=useSelector((state) => state.user.token);
  const role=useSelector((state)=>state.user.role)
  console.log("tokennnnn",token);
  console.log("hey kitty", userId);
  console.log("role",role)
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});
  const [getLike, setGetLike] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userProfie, setUserProfile] = useState("");
  const [allMatches, setAllMatches] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const notifyError = (message) =>
    toast.error(message, {
      autoClose: 3000,
      closeOnClick: true,
    });

  const notifySuccess = (message) =>
    toast.success(message, {
      autoClose: 3000,
      closeOnClick: true,
    });

  // to fetch the liked users
  const getLikedProfiles = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}:8000/api/v1/user/likedProfiles/${userId}`
      );
      console.log("liked profiles:", response.data.likedUsers);

      // Convert the array into an object for easy lookups
      const likedProfilesMap = response.data.likedUsers.reduce((acc, user) => {
        acc[user._id] = true;
        return acc;
      }, {});

      setGetLike(response.data.likedUsers); // Keep original array
      setLiked(likedProfilesMap); // Update liked state
    } catch (error) {
      console.log("Error fetching liked profiles", error);
    }
  };
  useEffect(() => {
    if (userId) {
      getLikedProfiles();
    }
  }, [userId]);
  // To like users
  const likedProfile = async (id) => {
    if (!userId || !id) {
      console.error("User ID or Profile ID is undefined");
      return;
    }

    // Optimistically update UI
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

    try {
      const response = await axios.post(
        `${baseUrl}:8000/api/v1/user/likeProfile/${userId}`,
        { likedId: id }
      );

      console.log("Liked profile response:", response.data);

      // If successfully liked, refresh liked profiles
      getLikedProfiles();
    } catch (error) {
      console.error("Error liking profile:", error);

      // Revert state if API fails
      setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };
  // opening of the hamburger
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  // userdetails
  const userDetails = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}:8000/api/v1/user/usercarddetails/${userId}`
      );
      console.log("response", response.data.data);
      setUserProfile(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  //top recomendations
  const TopMatch = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}:8000/api/v1/user/topmatch/${userId}`
      );
      let user = response.data.matches;
      const shuffledUsers = user.sort(() => 0.5 - Math.random()).slice(0, 5);

      console.log("topMatch", response.data.matches);
      setTopMatches(shuffledUsers);
    } catch (error) {
      console.log("error", error);
    }
  };
  // all matches
  const AllMatches = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}:8000/api/v1/user/getUserById/${userId}`
      );
      let users = response.data.user;

      const shuffledUsers = users.sort(() => 0.5 - Math.random()).slice(0, 5);
      console.log("all match", response.data.user);
      setAllMatches(shuffledUsers);
    } catch (error) {
      console.log("Error fetching all matches", error);
    }
  };

  useEffect(() => {
    userDetails();
    TopMatch();
    AllMatches();
  }, [userId]);
  // hamburger scrolling control
  useEffect(() => {
    const handleScrollHam = () => {
      const elements = [
        ...document.getElementsByClassName(DashStyles.ham1),
        ...document.getElementsByClassName(DashStyles.ham2),
        ...document.getElementsByClassName(DashStyles.ham3),
      ];
    
      elements.forEach((el) => {
        if (
          window.scrollY > 159 &&
          !el.classList.contains(DashStyles.open1) &&
          !el.classList.contains(DashStyles.open2) &&
          !el.classList.contains(DashStyles.open3)
        ) {
          el.style.display = "none";
        } else {
          el.style.display = "block";
        }
      });
    };
    
    

    window.addEventListener("scroll", handleScrollHam);
    return () => {
      window.removeEventListener("scroll", handleScrollHam);
    };
  }, []);
  // to view single profiles
  const profileView = async (id) => {
    if (!id) {
      console.log("Error fetching id");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}:8000/api/v1/user/usercarddetails/${id}`
      );
      console.log("single user data", response);
      navigate(`/mainuser/${id}`);
    } catch (error) {
      console.log("Error fetching the data", error);
    }
  };
  // to dynamically render the greetings
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning!";
    } else if (hour < 15) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  // to upload profile image
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.patch(
        `${baseUrl}:8000/api/v1/user/edit/${userId}`,
        formData
      );
      console.log("Upload successful:", response);
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setShowModal(false);
      setFile(null);
      setPreview(null);
    }
  };
  const handlePdfChange = (e) => {
    const selectedPdfFile = e.target.files[0];
    if (selectedPdfFile) {
      setPdfFile(selectedPdfFile);
      setPreview(URL.createObjectURL(selectedPdfFile));
      setPdfModal(true);
      pdfInputRef.current.value = null;

      // Close the dropdown menu to force re-render
      document
        .querySelector(`.${DashStyles.DropdownMenuSecondSmall}`)
        .classList.remove(DashStyles.show2);
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) return;
    const formData = new FormData();
    formData.append("pdfFile", pdfFile);

    try {
      const response = await axios.patch(
        `${baseUrl}:8000/api/v1/user/edit/${userId}`,
        formData
      );
      console.log("Upload successful:", response);

      // If upload is successful, show success notification
      if (response.status === 200) {
        notifySuccess(response.data.data.message || "Successfully Submitted.");
        setPdfModal(false); // Close modal after successful upload
      }
      const dropdownMenu = document.querySelector(
        `.${DashStyles.DropdownMenuSecondSmall}`
      );
      if (dropdownMenu && dropdownMenu.classList.contains(DashStyles.show2)) {
        dropdownMenu.classList.remove(DashStyles.show2);
      }
    } catch (error) {
      console.log("Upload error:", error);
      notifyError(error.response?.data?.message || "Please try again.");
    } finally {
      // Clear file input and preview
      setPdfFile(null);
      setPreview(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  
    return () => {
      document.body.style.overflow = ""; // Cleanup when unmounting
    };
  }, [isOpen]);
  


  return (
    <div>
      {/* <ToastContainer position="bottom-right" /> */}
      <div className={DashStyles.mainContainer}>
        <Nav userId={userId} />
        <div className={DashStyles.SubContainer}>
          {/* static details div for larger screens  starts*/}
          <div className={DashStyles.ProfileDiv}>
            <div className={DashStyles.ProfileCard}>
              <div
                className={DashStyles.ProfileImage}
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: "pointer" }}
              >
                <Avatar size={80} icon={<UserOutlined />} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
              {showModal && (
                <div className={DashStyles.modal}>
                  <div className={DashStyles.modalContent}>
                    <h3>Preview</h3>
                    <img
                      src={preview}
                      alt="Selected Preview"
                      style={{
                        objectFit: "cover",
                        borderRadius: "10px",
                        width: "236px",
                        height: "398px",
                        backgroundColor: " #f0c040",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    />
                    <div className={DashStyles.modalButtons}>
                      <button onClick={handleUpload}>Yes</button>
                      <button onClick={() => setShowModal(false)}>No</button>
                    </div>
                  </div>
                </div>
              )}
              <div className={DashStyles.ProfileDetails}>
                <p className={DashStyles.Greeting}>{greeting}</p>
                <h2 className={DashStyles.UserName}>{userProfie.firstName}</h2>
                {/* <p className={DashStyles.UserId}>Sanju@007</p> */}
                <p className={DashStyles.MemberId}>{userProfie.userId}</p>
                <p className={DashStyles.MembershipStatus}>Membership: Free</p>
                <button className={DashStyles.UpgradeButton}>Upgrade</button>
              </div>
            </div>
            <div className={DashStyles.ProfileCompletion}>
              <p style={{ fontWeight: "600", fontSize: "14px" }}>
                Complete your profile
              </p>
              {/* <p style={{ fontSize: "10px" }}>Your Profile Strength: 30%</p> */}
              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <Pen
                    size={20}
                    weight="duotone"
                    className={DashStyles.penIcon}
                  />
                </div>
                <div className={DashStyles.link}>
                  <Link to="/formpage1">Edit Profile</Link>
                </div>
              </div>
              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <Heart size={20} weight="duotone" />
                </div>
                <div className={DashStyles.link}>
                  <Link to={`/likedprofiles/${userId}`}>Liked Profiles</Link>
                </div>
              </div>
              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <User size={20} weight="duotone" />
                </div>
                <div className={DashStyles.link}>
                  <div
                    className={DashStyles.DropdownSecond}
                    onClick={() =>
                      document
                        .querySelector(`.${DashStyles.DropdownMenuSecond}`)
                        .classList.toggle(DashStyles.show)
                    }
                  >
                    Profile Verification
                    <div className={DashStyles.DropdownMenuSecond}>
                      <div
                        className={DashStyles.DropdownItemSecond}
                        onClick={() =>
                          document.getElementById("fileUpload").click()
                        }
                      >
                        Upload document
                        <input
                          type="file"
                          id="fileUpload"
                          onChange={handlePdfChange}
                          accept="application/pdf"
                          style={{ display: "none" }}
                          ref={pdfInputRef}
                        />
                      </div>

                      {pdfModal && (
                        <div className={DashStyles.PdfModalOverlay}>
                          <div className={DashStyles.PdfModalContent}>
                            <h3>Document Upload</h3>
                            {preview ? (
                              <p className={DashStyles.FileName}>
                                Selected File: {pdfFile.name}
                              </p>
                            ) : (
                              <p>No file selected</p>
                            )}

                            <div className={DashStyles.PdfModalActions}>
                              <button
                                onClick={handlePdfUpload}
                                className={DashStyles.PdfYesButton}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setPdfModal(false);
                                  setPdfFile(null);
                                  setPreview(null);
                                }}
                                className={DashStyles.PdfNoButton}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={DashStyles.SettingsMain}>
              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <Gear size={20} weight="duotone" />
                </div>
                <div className={DashStyles.link}>
                  <Link to={`/Usettings/${userId}`}>Settings</Link>
                </div>
              </div>
              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <Question size={20} weight="duotone" />
                </div>
                <div className={DashStyles.link}>
                  <div
                    className={DashStyles.HelpButton}
                    onClick={() =>
                      window.open(
                        "https://mail.google.com/mail/?view=cm&fs=1&to=support@example.com&su=Help%20Request",
                        "_blank"
                      )
                    }
                  >
                    Help
                  </div>
                </div>
              </div>

              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <ShieldCheck size={20} weight="duotone" />
                </div>
                <div className={DashStyles.link}>
                  <Link to={`/myprofile/${userId}`}>My Profile</Link>
                </div>
              </div>
              <div className={DashStyles.LinkIcon}>
                <div className={DashStyles.Icon}>
                  <SignOut size={20} weight="duotone" />
                </div>
                <div className={DashStyles.link}>
                  <Link
                    to="/"
                    onClick={() => {
                      dispatch(clearUser());
                      navigate("/");
                    }}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* static details div for larger screens  end*/}

          {/* Profile details div for small screens start */}
          <div
            className={isOpen ? "overlay overlayActive" : "overlay"}
          // onClick={toggleMenu}
          >
            <div className={DashStyles.HamburgerMain}>
              {/* {showHamburger&&( */}
              <div
                className={DashStyles.Hamburger}
                onClick={() => toggleMenu()}
              >
                <div
                  className={`${DashStyles.ham1} ${isOpen ? DashStyles.open1 : ""
                    }`}
                ></div>
                <div
                  className={`${DashStyles.ham2} ${isOpen ? DashStyles.open2 : ""
                    }`}
                ></div>
                <div
                  className={`${DashStyles.ham3} ${isOpen ? DashStyles.open3 : ""
                    }`}
                ></div>
              </div>
              {/* )} */}
              {/* profile div for smaller screens */}
              <div
                className={`${DashStyles.drawer} ${isOpen ? DashStyles.drawerOpen : DashStyles.drawerClosed
                  }`}
              >
                <div className={DashStyles.ProfileCard}>
                  <div
                    className={DashStyles.ProfileImage}
                    onClick={() => fileInputRef.current.click()}
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar size={80} icon={<UserOutlined />} />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {showModal && (
                    <div className={DashStyles.modal}>
                      <div className={DashStyles.modalContent}>
                        <h3>Preview</h3>
                        <img
                          src={preview}
                          alt="Selected Preview"
                          style={{
                            objectFit: "cover",
                            borderRadius: "10px",
                            width: "236px",
                            height: "398px",
                            backgroundColor: " #f0c040",
                            cursor: "pointer",
                            overflow: "hidden",
                          }}
                        />
                        <div className={DashStyles.modalButtons}>
                          <button onClick={handleUpload}>Yes</button>
                          <button onClick={() => setShowModal(false)}>
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={DashStyles.ProfileDetails}>
                    <p className={DashStyles.Greeting}>{greeting}</p>
                    <h2 className={DashStyles.UserName}>
                      {userProfie.firstName}
                    </h2>
                    {/* <p className={DashStyles.UserId}>Sanju@007</p> */}
                    <p className={DashStyles.MemberId}>{userProfie.userId}</p>
                    <p className={DashStyles.MembershipStatus}>
                      Membership: Free
                    </p>
                    <button className={DashStyles.UpgradeButton}>
                      Upgrade
                    </button>
                  </div>
                </div>
                <div className={DashStyles.ProfileCompletion}>
                  <p style={{ fontWeight: "600", fontSize: "20px" }}>
                    Complete your profile
                  </p>
                  <p style={{ fontSize: "10px" }}></p>
                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <Pen
                        size={20}
                        weight="duotone"
                        className={DashStyles.penIcon}
                      />
                    </div>
                    <div className={DashStyles.link}>
                      <Link to="/formpage1">Edit Profile</Link>
                    </div>
                  </div>
                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <Heart size={20} weight="duotone" />
                    </div>
                    <div className={DashStyles.link}>
                      <Link to={`/likedprofiles/${userId}`}>
                        Liked Profiles
                      </Link>
                    </div>
                  </div>
                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <User size={20} weight="duotone" />
                    </div>
                    <div className={DashStyles.link}>
                      <div
                        className={DashStyles.DropdownSecond}
                        onClick={() => {
                          console.log("Dropdown toggled");
                          document
                            .querySelector(
                              `.${DashStyles.DropdownMenuSecondSmall}`
                            )
                            .classList.toggle(DashStyles.show2);
                        }}
                      >
                        Profile Verification
                        <div className={DashStyles.DropdownMenuSecondSmall}>
                          <div
                            className={DashStyles.DropdownItemSecond}
                            onClick={() =>
                              document.getElementById("fileUpload").click()
                            }
                          >
                            Upload document
                            <input
                              type="file"
                              id="fileUpload"
                              onChange={handlePdfChange}
                              accept="application/pdf"
                              style={{ display: "none" }}
                              ref={pdfInputRef}
                            />
                          </div>
                        </div>
                        {pdfModal && (
                          <div className={DashStyles.PdfModalOverlay}>
                            <div className={DashStyles.PdfModalContent}>
                              <h3>Document Upload</h3>
                              {preview ? (
                                <p className={DashStyles.FileName}>
                                  Selected File: {pdfFile.name}
                                </p>
                              ) : (
                                <p>No file selected</p>
                              )}

                              <div className={DashStyles.PdfModalActions}>
                                <button
                                  onClick={handlePdfUpload}
                                  className={DashStyles.PdfYesButton}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => {
                                    setPdfModal(false);
                                    setPdfFile(null);
                                    setPreview(null);
                                  }}
                                  className={DashStyles.PdfNoButton}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={DashStyles.SettingsMain}>
                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <Gear size={20} weight="duotone" />
                    </div>
                    <div className={DashStyles.link}>
                      <Link to={`/Usettings/${userId}`}>Settings</Link>
                    </div>
                  </div>
                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <Question size={20} weight="duotone" />
                    </div>
                    <div className={DashStyles.link}>
                      <div
                        className={DashStyles.HelpButton}
                        onClick={() =>
                          window.open(
                            "https://mail.google.com/mail/?view=cm&fs=1&to=support@example.com&su=Help%20Request",
                            "_blank"
                          )
                        }
                      >
                        Help
                      </div>
                    </div>
                  </div>

                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <ShieldCheck size={20} weight="duotone" />
                    </div>
                    <div className={DashStyles.link}>
                      <Link to={`/myprofile/${userId}`}>My Profile</Link>
                    </div>
                  </div>
                  <div className={DashStyles.LinkIcon}>
                    <div className={DashStyles.Icon}>
                      <SignOut size={20} weight="duotone" />
                    </div>
                    <div className={DashStyles.link}>
                      <Link
                        to="/"
                        onClick={() => {
                          dispatch(clearUser());
                          navigate("/");
                        }}
                      >
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${DashStyles.Container} ${isOpen ? DashStyles.contentDimmed : ""
              }`}
          >
            <div className={DashStyles.OuterBox}>
              <div className={DashStyles.SmallBox}></div>
              <div className={DashStyles.BigBox}></div>
            </div>

            {/* Top recommendation start */}
            <div className={DashStyles.TopRecommendation}>
              <div className={DashStyles.trHeading}>
                <h2 className={DashStyles.TrHead}>Top Recommendations</h2>
                <h4 className={DashStyles.TrContent}>
                  Members who match your partner preference
                </h4>
              </div>
              <div className={DashStyles.trContentDisplay}>
                {topMatches && topMatches.length > 0 ? (
                  topMatches.map((item, index) => (
                    <div key={index} className={DashStyles.trCard}>
                      <div
                        className={DashStyles.trCardImg}
                        onClick={() => profileView(item.id)}
                      >
                        <img
                          src={
                            item.profilePicture
                              ? `${baseUrl}:8000${item.profilePicture}`
                              : " "
                          }
                          alt=""
                          className={DashStyles.cardImage}
                        />
                      </div>
                      <div className={DashStyles.trCardDetails}>
                        <div
                          className={DashStyles.trCardDetailSub}
                          onClick={() => profileView(item.id)}
                        >
                          <h5 className={DashStyles.trUserName}>{item.name}</h5>
                          <h6 className={DashStyles.trUserDetails}>
                            {item.age} Yrs ,{item.height}
                          </h6>
                        </div>
                        <div
                          className={DashStyles.LikeButton}
                          onClick={() => likedProfile(item.id)}
                        >
                          <HeartStraight
                            size={20}
                            weight={liked[item.id] ? "fill" : "light"}
                            className={`${DashStyles.likedHeartBefore} ${liked[item.id] ? DashStyles.likedHeart : ""
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No Top recommendations found</p>
                )}
              </div>
              <div className={DashStyles.SeeAll}>
                {/* <h4 className={DashStyles.saHead}>See All</h4> */}
                <Link to={`/toprecommendations/${userId}`}>
                  See All <span className={DashStyles.SpanArrow}>{">"}</span>
                </Link>
              </div>
            </div>
            {/* Top recommendation end */}
            {/* All Matches start */}
            <div className={DashStyles.TopRecommendation}>
              <div className={DashStyles.trHeading}>
                <h2 className={DashStyles.TrHead}>All Matches </h2>
              </div>

              <div className={DashStyles.trContentDisplay}>
                {allMatches && allMatches.length > 0 ? (
                  allMatches.map((item, index) => (
                    <div key={index} className={DashStyles.trCard}>
                      <div
                        className={DashStyles.trCardImg}
                        onClick={() => profileView(item._id)}
                      >
                        {/* image from backend */}
                        <img
                          src={
                            item.profilePicture
                              ? `${baseUrl}:8000${item.profilePicture}`
                              : ""
                          }
                          alt=""
                          className={DashStyles.cardImage}
                        />
                      </div>
                      <div className={DashStyles.trCardDetails}>
                        <div
                          className={DashStyles.trCardDetailSub}
                          onClick={() => profileView(item._id)}
                        >
                          <h5 className={DashStyles.trUserName}>
                            {item.firstName}
                          </h5>
                          <h6 className={DashStyles.trUserDetails}>
                            {item.age} Yrs, {item.height} cms
                          </h6>
                        </div>
                        <div
                          className={DashStyles.LikeButton}
                          onClick={() => likedProfile(item._id)}
                        >
                          <HeartStraight
                            size={20}
                            weight={
                              getLike[item._id] || liked[item._id]
                                ? "fill"
                                : "light"
                            }
                            className={`${DashStyles.likedHeartBefore} 
    ${liked[item._id] ? DashStyles.likedHeart : ""}
    ${getLike[item._id] ? DashStyles.likedHeart : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No matches found</p>
                )}
              </div>
              <div className={DashStyles.SeeAll}>
                {/* <h4 className={DashStyles.saHead}>See All</h4> */}
                <Link to={`/allmatches/${userId}`}>
                  See All <span className={DashStyles.SpanArrow}>{">"}</span>
                </Link>
              </div>
            </div>
            {/* All Matches end */}

            {/* Discover Matches start */}
            {/* <div className={DashStyles.PreferenceDiv}>
              <div className={DashStyles.trHeading}>
                <h2 className={DashStyles.TrHead}>Discover Matches</h2>
                <h4 className={DashStyles.TrContent}>
                  Explore profiles by matching your preferences
                </h4>
              </div>

              <div className={DashStyles.preferenceContent}>
                <div className={DashStyles.preferenceContentCard}>
                  <div className={DashStyles.PreferenceNameDiv}>
                    <h3 className={DashStyles.PreferenceName}>
                      Education (31)
                    </h3>
                  </div>
                </div>
                <div className={DashStyles.preferenceContentCard}>
                  <div className={DashStyles.PreferenceNameDiv}>
                    <h3 className={DashStyles.PreferenceName}>
                      Profession (31)
                    </h3>
                  </div>
                </div>
                <div className={DashStyles.preferenceContentCard}>
                  <div className={DashStyles.PreferenceNameDiv}>
                    <h3 className={DashStyles.PreferenceName}>
                      Profile With Photos (31)
                    </h3>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Discover Matches end */}
            {/* Nearby Matches start*/}
            {/* <div className={DashStyles.TopRecommendation}>
              <div className={DashStyles.trHeading}>
                <h2 className={DashStyles.TrHead}>Nearby Matches (20)</h2>
                <h4 className={DashStyles.TrContent}>
                  Explore matches by location
                </h4>
              </div>
              <div className={DashStyles.trContentDisplay}>
                <div className={DashStyles.trCard}>
                  <div className={DashStyles.trCardImg}>
                    <img
                      src={image}
                      alt="Crad imgae"
                      className={DashStyles.cardImage}
                    />
                  </div>
                  <div className={DashStyles.trCardDetails}>
                    <div className={DashStyles.trCardDetailSub}>
                      <h5 className={DashStyles.trUserName}>Gopika Krishnan</h5>
                      <h6 className={DashStyles.trUserDetails}>25 Yrs ,5'7"</h6>
                    </div>
                    <div
                      className={DashStyles.LikeButton}
                      onClick={() => likedProfile()}
                    >
                      <HeartStraight
                        size={20}
                        weight={liked ? "fill" : "light"}
                        className={`${DashStyles.likedHeartBefore} ${
                          liked ? DashStyles.likedHeart : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className={DashStyles.trCard}>
                  <div className={DashStyles.trCardImg}>
                    <img
                      src={image}
                      alt="Crad imgae"
                      className={DashStyles.cardImage}
                    />
                  </div>
                  <div className={DashStyles.trCardDetails}>
                    <div className={DashStyles.trCardDetailSub}>
                      <h5 className={DashStyles.trUserName}>Gopika Krishnan</h5>
                      <h6 className={DashStyles.trUserDetails}>25 Yrs ,5'7"</h6>
                    </div>
                    <div
                      className={DashStyles.LikeButton}
                      onClick={() => likedProfile()}
                    >
                      <HeartStraight
                        size={20}
                        weight={liked ? "fill" : "light"}
                        className={`${DashStyles.likedHeartBefore} ${
                          liked ? DashStyles.likedHeart : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className={DashStyles.trCard}>
                  <div className={DashStyles.trCardImg}>
                    <img
                      src={image}
                      alt="Crad imgae"
                      className={DashStyles.cardImage}
                    />
                  </div>
                  <div className={DashStyles.trCardDetails}>
                    <div className={DashStyles.trCardDetailSub}>
                      <h5 className={DashStyles.trUserName}>Gopika Krishnan</h5>
                      <h6 className={DashStyles.trUserDetails}>25 Yrs ,5'7"</h6>
                    </div>
                    <div
                      className={DashStyles.LikeButton}
                      onClick={() => likedProfile()}
                    >
                      <HeartStraight
                        size={20}
                        weight={liked ? "fill" : "light"}
                        className={`${DashStyles.likedHeartBefore} ${
                          liked ? DashStyles.likedHeart : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className={DashStyles.trCard}>
                  <div className={DashStyles.trCardImg}>
                    <img
                      src={image}
                      alt="Crad imgae"
                      className={DashStyles.cardImage}
                    />
                  </div>
                  <div className={DashStyles.trCardDetails}>
                    <div className={DashStyles.trCardDetailSub}>
                      <h5 className={DashStyles.trUserName}>Gopika Krishnan</h5>
                      <h6 className={DashStyles.trUserDetails}>25 Yrs ,5'7"</h6>
                    </div>
                    <div
                      className={DashStyles.LikeButton}
                      onClick={() => likedProfile()}
                    >
                      <HeartStraight
                        size={20}
                        weight={liked ? "fill" : "light"}
                        className={`${DashStyles.likedHeartBefore} ${
                          liked ? DashStyles.likedHeart : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={DashStyles.SeeAll}>
                
                <Link to="/">
                  See All <span className={DashStyles.SpanArrow}>{">"}</span>
                </Link>
              </div>
            </div> */}
            {/* Nearby Matches end*/}
            {/* Explore Matrimony start */}
            {/* <div className={DashStyles.ExploreMatrimonyDiv}>
              <div className={DashStyles.trHeading}>
                <h2 className={DashStyles.TrHead}>Explore Matrimony</h2>
              </div>
              <div className={DashStyles.ExploreContent}>
                <div className={DashStyles.ExploreContentIcons}>
                  <div className={DashStyles.ExploreIcons}>
                    <Shield size={76} color="#f0c040" weight="light" />
                    <h6 className={DashStyles.ExplorePara}>Saftey & Privacy</h6>
                  </div>
                  <div className={DashStyles.ExploreIcons}>
                    <Headset size={76} color="#f0c040" weight="light" />
                    <h6 className={DashStyles.ExplorePara}>Help & Support</h6>
                  </div>
                  <div className={DashStyles.ExploreIcons}>
                    <Users size={76} color="#f0c040" weight="light" />
                    <h6 className={DashStyles.ExplorePara}>
                      100% Matched Profiles
                    </h6>
                  </div>
                  <div className={DashStyles.ExploreIcons}>
                    <Crown size={76} color="#f0c040" weight="light" />{" "}
                    <h6 className={DashStyles.ExplorePara}>
                      Premium Membership
                    </h6>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Explore Matrimony end */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
