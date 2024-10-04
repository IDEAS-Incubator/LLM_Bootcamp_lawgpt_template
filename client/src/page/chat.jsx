import React, { useEffect, useReducer, useRef, useState } from "react";
import { Reload, Rocket, Stop } from "../assets";
import { Chat, New } from "../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import ReactMarkdown from "react-markdown";
import "./style.scss";

const reducer = (state, { type, status }) => {
  switch (type) {
    case "chat":
      return {
        chat: status,
        loading: status,
        resume: status,
        actionBtns: false,
      };
    case "error":
      return {
        chat: true,
        error: status,
        resume: state.resume,
        loading: state.loading,
        actionBtns: state.actionBtns,
      };
    case "warning":
      return {
        chat: true,
        warning: status,
        resume: state.resume,
        loading: state.loading,
        actionBtns: state.actionBtns,
      };
    case "resume":
      return {
        chat: true,
        resume: status,
        loading: status,
        actionBtns: true,
      };

    default:
      return state;
  }
};

const Main = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatRef = useRef();
  const { id = null } = useParams();
  const { user } = useSelector((state) => state);

  const [status, stateAction] = useReducer(reducer, {
    chat: false,
    error: false,
    actionBtns: false,
  });

  useEffect(() => {
    if (user) {
      dispatch(emptyAllRes());
      setTimeout(() => {
        if (id) {
          // Simulate fetching saved chat (instead of API call)
          const getSaved = () => {
            const mockData = [{ chatId: id, prompt: "Saved Chat Prompt", content: "Saved chat content" }];
            dispatch(addList({ _id: id, items: mockData }));
            stateAction({ type: "resume", status: false });
          };
          getSaved();
        } else {
          stateAction({ type: "chat", status: false });
        }
      }, 1000);
    }
  }, [location]);

  return (
    <div className="main">
      <div className="contentArea">
        {status.chat ? (
          <Chat
            ref={chatRef}
            status={status}
            error={status.error}
            warning={status.warning}
          />
        ) : (
          <New />
        )}
      </div>
      <InputArea status={status} chatRef={chatRef} stateAction={stateAction} />
    </div>
  );
};

//Input Area
const InputArea = ({ status, chatRef, stateAction }) => {
  let textAreaRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prompt, content, _id } = useSelector((state) => state.messages);
  const [textSubmitted, setTextSubmitted] = useState(false);

  const FormHandle = () => {
    if (prompt?.length > 0) {
      stateAction({ type: "chat", status: true });
      let chatsId = Date.now();

      dispatch(insertNew({ id: chatsId, content: "", prompt }));
      chatRef?.current?.clearResponse();
      dispatch(livePrompt(""));
      setTextSubmitted(true);

      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = "31px"; // Default height after submitting
      }

      // Simulate chat submission (no API call)
      const mockResponse = { _id: chatsId, content: "Generated Response" };
      setTimeout(() => {
        dispatch(insertNew({ _id: mockResponse._id, chatsId }));
        chatRef?.current?.loadResponse(stateAction, mockResponse.content, null, chatsId);
        stateAction({ type: "resume", status: false });
        stateAction({ type: "error", status: false });
      }, 1000);
    }
  };

  useEffect(() => {
    const adjustTextAreaHeight = () => {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    };

    textAreaRef.current.addEventListener("input", adjustTextAreaHeight);

    if (textAreaRef.current && prompt.length === 0 && textSubmitted) {
      textAreaRef.current.style.height = "31px";
    }
  }, [prompt, textSubmitted]);

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      FormHandle();
    }
  };

  return (
    <div className="inputArea">
      <div className="chatActionsLg">
        {status.chat && content?.length > 0 && status.actionBtns && (
          <>
            {!status?.resume ? (
              <button onClick={() => chatRef.current.loadResponse(stateAction)}>
                <Reload /> Regenerate response
              </button>
            ) : (
              <button onClick={() => chatRef.current.stopResponse(stateAction)}>
                <Stop /> Stop generating
              </button>
            )}
          </>
        )}
      </div>

      <div className="flexBody">
        <div className="box">
          <textarea
            placeholder="Press Ctrl+Enter To Submit..."
            ref={textAreaRef}
            value={prompt}
            onChange={(e) => dispatch(livePrompt(e.target.value))}
            onKeyDown={handleKeyDown}
          />
          {!status?.loading ? (
            <button onClick={FormHandle}>{<Rocket />}</button>
          ) : (
            <div className="loading">
              <div className="dot" />
              <div className="dot-2 dot" />
              <div className="dot-3 dot" />
            </div>
          )}
        </div>

        {status.chat && content?.length > 0 && status.actionBtns && (
          <>
            {!status?.resume ? (
              <div className="chatActionsMd">
                <button onClick={() => chatRef.current.loadResponse(stateAction)}>
                  <Reload />
                </button>
              </div>
            ) : (
              <div className="chatActionsMd">
                <button onClick={() => chatRef.current.stopResponse(stateAction)}>
                  <Stop />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="text">
        Free Bayes Preview Research. Our goal is to make AI systems more natural
        and safe to interact with. Your feedback will help us improve.
      </div>
    </div>
  );
};

export default Main;
