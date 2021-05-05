import { useRef, useEffect, useState } from "react";

export default function VideoMaterial({ url, side }) {
  const videoRef = useRef(url);

  const [video, setVideo] = useState(createVideo);
  const [current, setCurrent] = useState(true);

  function createVideo() {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsinline = true;
    vid.autoplay = true;
    vid.play();
    return vid;
  }

  useEffect(() => {
    if (videoRef.current !== url && videoRef.current) {
      setVideo(createVideo());
      if (current) {
        setCurrent(false);
      } else {
        setCurrent(true);
      }

      videoRef.current = url;
    }
  }, [url]);

  return (
    <meshBasicMaterial depthTest={true} side={side} opacity={1}>
      {current && <videoTexture attach="map" args={[video]} />}
      {!current && <videoTexture attach="map" args={[video]} />}
    </meshBasicMaterial>
  );
}
