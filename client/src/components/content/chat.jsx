import React, {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RobotIcon } from "../../assets";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";

import { insertNew } from "../../redux/messages";
import "./style.scss";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { MarkdownRenderer } from "./markdown";

const Chat = forwardRef(({ error, status, warning }, ref) => {
  const dispatch = useDispatch();

  const contentRef = useRef(null);

  const containerRef = useRef(); // for scroll down

  const { user, messages } = useSelector((state) => state);
  const { latest, content, all, imageUrl } = messages;

  const loadResponse = async (
    stateAction,
    response = content,
    imageUrl,
    chatsId = latest?.id
  ) => {
    clearInterval(window.interval);
    stateAction({ type: "resume", status: true });

    // Insert the content into the Redux store
    dispatch(insertNew({ chatsId, imageUrl, content: response, resume: true }));

    // Stop response immediately
    stopResponse(stateAction);
  };

  const stopResponse = (stateAction) => {
    if (contentRef?.current) {
      contentRef.current.classList.remove("blink");
    }
    stateAction({ type: "resume", status: false });
    clearInterval(window.interval);
  };

  useImperativeHandle(ref, () => ({
    stopResponse,
    loadResponse,
    clearResponse: () => {
      if (contentRef?.current) {
        contentRef.current.innerHTML = "";
        contentRef?.current?.classList.add("blink");
      }
    },
  }));

  useEffect(() => {
    containerRef.current.scrollIntoView();
  }, [latest, content, all, imageUrl]);

  return (
    <div className="Chat">
      {all
        ?.filter((obj) => {
          return !obj.id ? true : obj?.id !== latest?.id;
        })
        ?.map((obj, key) => {
          return (
            <Fragment key={key}>
              <div className="qs">
                <div className="acc">{user?.fName?.charAt(0)}</div>
                <div className="txt">
                  <MarkdownRenderer content={obj?.prompt} />
                </div>
              </div>

              <div className="res">
                <div className="icon">
                  <RobotIcon />
                </div>
                <div className="txt">
                  <span>
                    <MarkdownRenderer content={obj?.content} />
                    {obj.imageUrl && (
                      <LazyLoadImage
                        src={obj.imageUrl}
                        alt="Image"
                        effect="blur"
                      />
                    )}
                  </span>
                </div>
              </div>
            </Fragment>
          );
        })}

      {latest?.prompt?.length > 0 && (
        <Fragment>
          <div className="qs">
            <div className="acc">{user?.fName?.charAt(0)}</div>
            <div className="txt">
              <MarkdownRenderer content={latest?.prompt} />
            </div>
          </div>

          <div className="res">
            <div className="icon">
              <RobotIcon />

              {error && <span>!</span>}
              {warning && <span>! </span>}
            </div>
            <div className="txt">
              {warning && (
                <div className="warning">
                  Your request was rejected as a result of our safety system.
                  Your prompt may contain text that is not allowed by our safety
                  system.
                </div>
              )}
              {error && (
                <div className="warning">Something went wrong. Try Again</div>
              )}
              {!status?.resume && !warning && !error && (
                <div className="blink">
                  <MarkdownRenderer content={latest?.content} />

                  {latest?.imageUrl && (
                    <LazyLoadImage
                      src={latest?.imageUrl}
                      alt="Image"
                      effect="blur"
                    />
                  )}
                </div>
              )}
              {status?.resume && !warning && !error && (
                <span className="loading-text">Loading....</span>
              )}
            </div>
          </div>
        </Fragment>
      )}
      <div ref={containerRef} />
    </div>
  );
});
export default Chat;
