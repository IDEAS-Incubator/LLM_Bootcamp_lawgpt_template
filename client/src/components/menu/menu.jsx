import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Bar,
  LogOut,
  Message,
  Plus,
  Settings,
  Tab,
  Tick,
  Trash,
  Xicon,
} from "../../assets/";
import { activePage, addHistory } from "../../redux/history";
import { emptyUser } from "../../redux/user";
import "./style.scss";

const Menu = ({ changeColorMode }) => {
  let path = window.location.pathname;

  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const settingRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { history, user } = useSelector((state) => state);
  const [confirm, setConfim] = useState(false);

  const logOut = () => {
    if (window.confirm("Do you want to log out?")) {
      // Simulate logout and navigate to login page
      alert("Logged out successfully");
      dispatch(emptyUser());
      navigate("/login");
    }
  };

  const clearHistory = (del) => {
    if (del) {
      // Simulate clearing chat history
      alert("Chat history cleared");
      navigate("/chat");
      dispatch(addHistory([]));
      setConfim(false);
    } else {
      setConfim(true);
    }
  };

  const deleteChat = (chatId) => {
    if (window.confirm("Do you want to delete this chat?")) {
      // Simulate chat deletion
      const updatedHistory = history.filter((obj) => obj.chatId !== chatId);
      dispatch(addHistory(updatedHistory));
      alert("Chat deleted successfully");
      navigate("/chat");
    }
  };

  const showMenuMd = () => {
    menuRef.current.classList.add("showMd");
    document.body.style.overflowY = "hidden";
  };

  //Menu
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        !menuRef?.current?.contains(e.target) &&
        !btnRef?.current?.contains(e.target)
      ) {
        menuRef?.current?.classList?.remove("showMd");
        document.body.style.overflowY = "auto";
      }
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width:767px)").matches) {
        document.body.style.overflowY = "auto";
      } else {
        if (menuRef?.current?.classList?.contains("showMd")) {
          document.body.style.overflowY = "hidden";
        } else {
          document.body.style.overflowY = "auto";
        }
      }
    });
  });

  // History Get (Simulated)
  useEffect(() => {
    const getHistory = () => {
      // Simulate history fetching
      dispatch(addHistory([{ chatId: "1", prompt: "Sample chat" }]));
    };

    getHistory();
  }, [path]);

  // History active
  useEffect(() => {
    setConfim(false);
    let chatId = path.replace("/chat/", "");
    chatId = chatId.replace("/", "");
    dispatch(activePage(chatId));
  }, [path, history]);

  return (
    <Fragment>
      <Modal changeColorMode={changeColorMode} settingRef={settingRef} />

      <header>
        <div className="start">
          <button onClick={showMenuMd} ref={btnRef}>
            <Bar />
          </button>
        </div>

        <div className="title">
          {path.length > 6 ? history[0]?.prompt : "New chat"}
        </div>

        <div className="end">
          <button
            onClick={() => {
              if (path.includes("/chat")) {
                navigate("/");
              } else {
                navigate("/chat");
              }
            }}
          >
            <Plus />
          </button>
        </div>
      </header>

      <div className="menu" ref={menuRef}>
        <div>
          <button
            type="button"
            aria-label="new"
            onClick={() => {
              if (path.includes("/chat")) {
                navigate("/");
              } else {
                navigate("/chat");
              }
            }}
          >
            <Plus />
            New chat
          </button>
        </div>

        <div className="history">
          {history?.map((obj, key) => (
            <div key={key} className="chat-item">
              <button
                className="active"
                onClick={() => {
                  navigate(`/chat/${obj?.chatId}`);
                }}
              >
                <Message />
                {obj?.prompt}
              </button>
              <span
                className="delete-button"
                onClick={() => deleteChat(obj?.chatId)} // Delete chat
              >
                <Trash />
              </span>
            </div>
          ))}
        </div>

        <div className="actions">
          {history?.length > 0 && (
            <>
              {confirm ? (
                <button onClick={() => clearHistory(true)}>
                  <Tick />
                  Confirm clear conversations
                </button>
              ) : (
                <button onClick={() => clearHistory(false)}>
                  <Trash />
                  Clear conversations
                </button>
              )}
            </>
          )}

          <button
            onClick={() => {
              if (settingRef?.current) {
                settingRef.current.classList.add("clicked");
                settingRef.current.style.display = "flex";
              }
            }}
          >
            <Settings />
            Settings
          </button>

          <button onClick={logOut}>
            <LogOut />
            Log out
          </button>
        </div>
      </div>

      <div className="exitMenu">
        <button>
          <Xicon />
        </button>
      </div>
    </Fragment>
  );
};

export default Menu;
