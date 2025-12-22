import { useEffect, useState } from "react";
import {  Socket } from "socket.io-client";
import type { ShapeInterface } from "../type/shapes";
// import { deserializeShape } from "../utils/deserializeShape";
import '../style/share.css'
import type { Canvas } from "../classes/drawing/canvas";
import { Helper } from "../classes/Helper/helper";

/// when editing the shapes is being draw multiple times to the next user.    solved!!
// shapes attributes not changing in real time // solved!!
// change the eraser in socket not working // solved!!
// when making shapes with ai those shapes are coming but stuttering when moving to the next user //solved!!

// change the text box on single click // 
  
// improve free draw brush add in scoket in localstorage solved!!



interface ShareProps {
//   a full array (setShapes(newArray)), or
// a function (setShapes(prev => [...prev, newShape])).
  setShapes:  React.Dispatch<React.SetStateAction<ShapeInterface[]>>;
  shapes: ShapeInterface[];
  setRoomId: (roomId: string) => void;
  roomId: string;
  socket: Socket;
  canvasInstance: Canvas |null;
}

const Share = ({ socket, shapes, setShapes, roomId, setRoomId, canvasInstance }: ShareProps) => {
  const [windowOn, setWindowOn] = useState(false);
  const [isSession, setIsSession] = useState(false);
  // const [roomId, setRoomId] = useState("");

  // Extract roomId from URL when component mounts
  useEffect(() => {
    const path = window.location.pathname.slice(1);
    if (path) {
      setRoomId(path);
    }
  }, [setRoomId]);

  // Connect socket once on mount
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Connected:", socket.id);
      if (roomId) {
        socket.emit("room", roomId);
        console.log("Joined room:", roomId);
      }
    };

    const onDisconnect = () => {
      console.log("Disconnected from server");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Listen for drawing updates ONCE
   socket.on("drawing", (shape) => {
  const deserialized: ShapeInterface[] = Array.isArray(shape)
    ? shape.map(s => Helper.deserializeShape(s))
    : [Helper.deserializeShape(shape)];

     
  setShapes(prev =>  {
    const updated = [...prev];
    for (const newShape of deserialized) {
      const idx = updated.findIndex(s => s.id === newShape.id);
      if (idx !== -1) {
        updated[idx] = newShape; // replace existing
      } else {
        updated.push(newShape);  // add new
      }
    }

    // also update canvas storage
    if (canvasInstance) {
      canvasInstance.storage.shapes = [...updated];
      canvasInstance.draw();
    }

    return updated;
  });
});



    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("drawing");
    };
  }, [roomId, setShapes,shapes, socket, canvasInstance]);


  useEffect(() => {
 socket.on("take-delete-shape", (shapeId) => {
    console.log(shapes)

  setShapes((prev: ShapeInterface[]) => {
    const updated = prev.filter(s => s.id !== shapeId);
    console.log(updated)

    if (canvasInstance) {
      canvasInstance.storage.shapes = [...updated];
      canvasInstance.draw();
    }

    return updated;
  }) 
});


  return () => {
    socket.off("take-delete-shape");
  };
}, [canvasInstance, setShapes, shapes, socket]);


useEffect(() => {
  if (!socket.connected || !roomId) return;

  const handleClear = (emptyArray: []) => {
    setShapes(emptyArray);
    if (canvasInstance) {
      canvasInstance.storage.shapes = emptyArray;
      // console.log(canvasInstance.storage.shapes)
      canvasInstance.draw(); // redraw cleared
    }
  };

  socket.on("take-clear-canvas", handleClear);

  return () => {
    socket.off("take-clear-canvas", handleClear); // cleanup
  };
}, [canvasInstance, socket, roomId, setShapes, shapes]);




 

  const createSession = () => {
    if (!socket.connected) {
      socket.connect();
    }

    const randomString = Math.random().toString(36).substring(2, 10);
    setRoomId(randomString);

    // Update URL
    window.history.pushState({}, "", randomString);

    // Immediately join room
    socket.emit("room", randomString);
    console.log("Session created with ID:", randomString);

    setIsSession(true);
  };

  const removeSession = () => {
    setRoomId("");
    window.history.pushState({}, "", "/");
    setIsSession(false);
  };

  return (
    <div>
      <button className="blue-button" onClick={() => setWindowOn(prev => !prev)}>Share</button>

      {windowOn && (
        <div className="content"
        >
          <button className="close" onClick={() => setWindowOn(false)}>X</button>
          <h1>Share this link to collaborate:</h1>
          {!isSession && !roomId ? (
            <button onClick={createSession}>Create Session</button>
          ) : (
            <div>
              <input
                type="text"
                value={window.location.href}
                readOnly
                style={{ width: "80%" }}
              />
              <button className="red-button" onClick={removeSession}>Stop Session</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Share;
