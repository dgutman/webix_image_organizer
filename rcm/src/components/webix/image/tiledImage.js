import OpenSeadragon from "openseadragon";
import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
  useMemo
} from "react";
import { v4 as uuidV4 } from "uuid";
import { createPortal } from "react-dom";
import { sortWith, pathOr, ascend } from "ramda";
import { throttle } from "throttle-debounce";
import { useInterval } from "./useInterval";

const DeepZoomAreaContext = React.createContext({});
const ImageContext = React.createContext({ inImage: false });

// function App() {
//   return (
//     <DeepZoomArea>
//       <TiledImage href="/images/something">
//         <Overlay
//           rectangle={{ x: 0, y: 0, width: 10, height: 10 }}
//           position={OpenSeadragon.OverlayPlacement.TOP_LEFT}
//         >
//           overlay content goes here...
//         </Overlay>
//       </TiledImage>
//     </DeepZoomArea>
//   );
// }

const useId = () => React.useRef(uuidV4()).current;

function reducer(
  state = {
    images: [],
    metadata: {},
    drawn: {}
  },
  action
) {
  switch (action.type) {
    case "ADDED_IMAGE":
      return { ...state, images: [...state.images, action.image] };
    case "FIRST_TILE_DRAWN":
      return { ...state, drawn: { ...state.drawn, [action.image]: true } };
    case "REGISTER_METADATA":
      return {
        ...state,
        metadata: { ...state.metadata, [action.image]: action }
      };
    case "REMOVED_IMAGE":
      return {
        ...state,
        images: state.images.filter(img => img !== action.image),
        drawn: { ...state.drawn, [action.image]: undefined }
      };
    default:
      return state;
  }
}

export function DeepZoomArea({ children, className, style, disableZoom }) {
  const [viewer, setViewer] = useState(null);
  const [ready, setReady] = useState(true);
  const [state, dispatch] = useReducer(reducer, null, () =>
    reducer(undefined, { type: "INIT" })
  );

  const id = useId();

  useEffect(() => {
    if (!ready) return;
    const viewer_ = OpenSeadragon({
      id,
      showFullPageControl: false,
      showHomeControl: false,
      showZoomControl: false,
      showNavigator: true,
      navigatorPosition: "TOP_LEFT",
      showNavigationControl: true,
      navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
      prefixUrl: ""
    });
    window.viewer = viewer_;
    setViewer(viewer_);
    return async () => {
      setReady(false);
      if (OpenSeadragon.isFullScreen()) {
        // need to avoid a crash by waiting for asynchronous leaving fullscreen
        // before making a new viewer attached to the same node
        await new Promise(resolve => {
          viewer_.addOnceHandler("full-screen", resolve);
          viewer_.setFullScreen(false);
        });
      }
      // detach openseadragon from html node
      viewer_.destroy();
      setReady(true);
    };
  }, [id, ready]);

  useInterval(() => {
    if (!viewer) return;

    let items = [];
    for (let i = 0; i < viewer.world.getItemCount(); i++) {
      items.push(viewer.world.getItemAt(i));
    }

    const fallback = item =>
      pathOr(false, ["metadata", item.href, "fallback"], state) ? 1 : 0;
    const index = item => {
      const thing = pathOr(-1, ["metadata", item.href, "index"], state);
      return thing;
    };

    const sorted = sortWith([ascend(fallback), ascend(index)], items);
    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const currentIndex = viewer.world.getIndexOfItem(item);
      if (currentIndex !== i) {
        viewer.world.setItemIndex(item, i);
      }
    }
  }, 500);

  React.useEffect(() => {
    if (!viewer) return;
    const timeout = setTimeout(() => {
      viewer.gestureSettingsMouse.clickToZoom = !disableZoom;
    }, 10);
    return () => clearTimeout(timeout);
  }, [viewer, disableZoom]);

  const contextValue = React.useMemo(() => ({ state, dispatch, viewer }), [
    state,
    dispatch,
    viewer
  ]);

  return (
    <DeepZoomAreaContext.Provider value={contextValue}>
      <div id={id} style={style} className={className} />
      {viewer ? children : null}
    </DeepZoomAreaContext.Provider>
  );
}

const nonFallbackShown = state =>
  Object.keys(state.drawn)
    .filter(key => state.drawn[key])
    .filter(drawn => !state.fallback[drawn]).length > 0;

export function TiledImage({
  href,
  hidden,
  fallback,
  index,
  onClick,
  children,
  x,
  y,
  width,
  height
}) {
  const { viewer, state, dispatch } = useContext(DeepZoomAreaContext);
  const [image, setImage] = useState(null);
  const invisible = hidden || (fallback && nonFallbackShown(state));
  const visible = !invisible;

  useEffect(() => {
    setImage(null);
    dispatch({ type: "ADDING_IMAGE", image: href });
    const promise = new Promise((resolve, reject) => {
      viewer.addTiledImage({
        tileSource: href,
        success: resolve,
        failure: reject,
        x,
        y,
        width,
        height
      });
    }).then(({ item }) => {
      dispatch({ type: "ADDED_IMAGE", image: href });
      item.href = href;
      setImage(item);
      return item;
    });
    promise.catch(() => {
      dispatch({ type: "IMAGE_FAILURE", image: href });
    });

    return () => {
      dispatch({ type: "REMOVING_IMAGE", image: href });
      promise.then(tiledImage => {
        dispatch({ type: "REMOVED_IMAGE", image: href });
        viewer.world.removeItem(tiledImage);
        setImage(currentImage => {
          if (currentImage === tiledImage) {
            return null;
          } else {
            return currentImage;
          }
        });
      });
    };
  }, [href, dispatch, viewer, x, y, width, height]);

  useEffect(() => {
    // there is probably a race condition here if the tile is drawn too quickly after the image is initialized above
    // can probably be fixed (if it is a problem) by moving this into the `addTiledImage` effect
    function handler({ tiledImage }) {
      if (tiledImage === image) {
        dispatch({ type: "FIRST_TILE_DRAWN", image: href });
      }
    }
    viewer.addOnceHandler("tile-drawn", handler);
    return () => {
      viewer.removeHandler("tile-drawn", handler);
    };
  }, [viewer, image, dispatch, href]);

  useEffect(() => {
    dispatch({
      type: "REGISTER_METADATA",
      image: href,
      index,
      fallback,
      hidden
    });
  }, [index, href, dispatch, fallback, hidden]);

  useEffect(() => {
    if (image) image.setOpacity(visible ? 1 : 0);
  }, [image, visible]);

  useOpenSeadragonClickHandler(image, onClick);

  return (
    <ImageContext.Provider value={{ image, inImage: true }}>
      {image ? children || null : null}
    </ImageContext.Provider>
  );
}

// ready flag isn't in here
export function SimpleImage({
  href,
  fallback,
  hidden,
  index,
  children,
  x,
  y,
  height,
  width,
  onClick
}) {
  const { viewer, state, dispatch } = React.useContext(DeepZoomAreaContext);
  const [image, setImage] = useState(null);
  const invisible = hidden || (fallback && nonFallbackShown(state));
  const visible = !invisible;

  React.useEffect(() => {
    setImage(null);
    dispatch({ type: "ADDING_IMAGE", image: href });
    const promise = new Promise((resolve, reject) => {
      viewer.addSimpleImage({
        url: href,
        success: resolve,
        failure: reject,
        x,
        y,
        width,
        height
      });
    }).then(({ item }) => {
      dispatch({ type: "ADDED_IMAGE", image: href });
      item.href = href;
      setImage(item);
      return item;
    });
    promise.catch(() => {
      dispatch({ type: "IMAGE_FAILURE", image: href });
    });

    return () => {
      dispatch({ type: "REMOVING_IMAGE", image: href });
      promise.then(tiledImage => {
        dispatch({ type: "REMOVED_IMAGE", image: href });
        viewer.world.removeItem(tiledImage);
        setImage(currentImage => {
          if (currentImage === tiledImage) {
            return null;
          } else {
            return currentImage;
          }
        });
      });
    };
  }, [dispatch, href, viewer, x, y, width, height]);

  useEffect(() => {
    if (image) image.setOpacity(visible ? 1 : 0);
  }, [image, visible]);

  useOpenSeadragonClickHandler(image, onClick);

  return (
    <ImageContext.Provider value={{ image, inImage: true }}>
      {image ? children || null : null}
    </ImageContext.Provider>
  );
}

function useOpenSeadragonClickHandler(image, onClick) {
  const { viewer } = useContext(DeepZoomAreaContext);
  const clickRef = useCallbackRef(onClick);

  const handler = React.useCallback(
    event => {
      if (!image) return;
      const viewportPoint = viewer.viewport.pointFromPixel(event.position);
      const imagePoint = image.viewportToImageCoordinates(viewportPoint);
      const { x: width, y: height } = image.getContentSize();

      if (imagePoint.x < 0) return;
      if (imagePoint.y < 0) return;
      if (imagePoint.x > width) return;
      if (imagePoint.y > height) return;

      clickRef.current({ position: imagePoint, imageSize: { height, width } });
    },
    [clickRef, image, viewer]
  );

  useOpenSeadragonHandler("canvas-click", handler);
}

function useCallbackRef(callback = () => {}) {
  const callbackRef = useRef(callback || (() => {}));
  React.useEffect(() => {
    callbackRef.current = callback || (() => {});
  }, [callback]);
  return callbackRef;
}

function useOpenSeadragonHandler(eventName, handler) {
  const { viewer } = useContext(DeepZoomAreaContext);

  useEffect(() => {
    viewer.addHandler(eventName, handler);
    return () => {
      viewer.removeHandler(eventName, handler);
    };
  }, [eventName, handler, viewer]);
}

function convert(rectangle, image) {
  // change from image coordinate system to viewport coordinate system
  if (!image) return null;
  return image.imageToViewportRectangle(
    new OpenSeadragon.Rect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    )
  );
}

export function Overlay({
  placement = OpenSeadragon.OverlayPlacement.TOP_LEFT,
  rectangle,
  viewportCoordinates,
  children
}) {
  const { viewer } = useContext(DeepZoomAreaContext);
  const { image, inImage } = useContext(ImageContext);
  const [element] = useState(document.createElement("div"));

  const viewportRectangle =
    inImage && !viewportCoordinates
      ? convert(rectangle, image)
      : new OpenSeadragon.Rect(
          rectangle.x,
          rectangle.y,
          rectangle.width,
          rectangle.height
        );

  useEffect(() => {
    viewer.addOverlay(
      element,
      new OpenSeadragon.Rect(0, 0, 0, 0),
      OpenSeadragon.Placement.TOP_LEFT
    );
  }, [viewer, element]);

  useEffect(() => {
    viewer.updateOverlay(element, viewportRectangle, placement);
  }, [viewer, placement, viewportRectangle, element]);

  return createPortal(children, element);
}

export function Control({
  position = OpenSeadragon.ControlAnchor.TOP_RIGHT,
  autoFade,
  children
}) {
  const [containerEl] = useState(document.createElement("div"));
  const { viewer } = useContext(DeepZoomAreaContext);

  useEffect(() => {
    viewer.addControl(containerEl, {
      anchor: position,
      autoFade
    });
    return () => {
      viewer.removeControl(containerEl);
    };
  }, [autoFade, containerEl, position, viewer]);

  return createPortal(children, containerEl);
}

function inside(rectangle, position) {
  return (
    position.x >= rectangle.x &&
    position.x <= rectangle.x + rectangle.width &&
    position.y >= rectangle.y &&
    position.y <= rectangle.y + rectangle.height
  );
}

const initialDragState = {
  rectangle: {
    x: 0.45,
    y: 0.45,
    width: 0.1,
    height: 0.1
  },
  dragging: false,
  sliding: false
};

function toRectangle(point1, point2) {
  const xs = [point1.x, point2.x].sort();
  const ys = [point1.y, point2.y].sort();

  return {
    x: xs[0],
    y: ys[0],
    width: xs[1] - xs[0],
    height: ys[1] - ys[0]
  };
}

function dragStateReducer(state = initialDragState, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        rectangle: action.defaultRectangle
      };
    case "PRESS":
      if (inside(state.rectangle, action.position)) {
        return {
          ...state,
          dragging: false,
          sliding: true,
          startPosition: action.position,
          endPosition: action.position
        };
      }
      return {
        ...state,
        dragging: true,
        sliding: false,
        startPosition: action.position,
        endPosition: action.position,
        rectangle: {
          x: action.position.x,
          y: action.position.y,
          width: 0,
          height: 0
        }
      };
    case "DRAG":
      return {
        ...state,
        endPosition: { x: action.position.x, y: action.position.y }
      };
    case "DRAGEND":
      if (state.sliding) {
        return {
          dragging: false,
          sliding: false,
          rectangle: findRectangle(state)
        };
      }
      if (state.dragging) {
        return {
          dragging: false,
          sliding: false,
          rectangle: toRectangle(state.startPosition, state.endPosition)
        };
      }
      return state;
    default:
      return state;
  }
}

function findRectangle(state) {
  if (state.sliding) {
    const deltaX = state.endPosition.x - state.startPosition.x;
    const deltaY = state.endPosition.y - state.startPosition.y;
    return {
      ...state.rectangle,
      x: state.rectangle.x + deltaX,
      y: state.rectangle.y + deltaY
    };
  }
  if (state.dragging) {
    return toRectangle(state.startPosition, state.endPosition);
  }
  return state.rectangle;
}

export function DragSelector({ onChange }) {
  const { viewer } = useContext(DeepZoomAreaContext);
  const { inImage, image } = useContext(ImageContext);
  const [state, dispatch] = useReducer(dragStateReducer, null, () =>
    dragStateReducer(undefined, {
      type: "INIT",
      defaultRectangle: new OpenSeadragon.Rect(0.45, 0.45, 0.3, 0.3)
    })
  );

  useMouseEvents(viewer, dispatch);

  const onChangeRef = useCallbackRef(onChange);

  useEffect(() => {
    let rectangle = new OpenSeadragon.Rect(
      state.rectangle.x,
      state.rectangle.y,
      state.rectangle.width,
      state.rectangle.height
    );
    if (inImage) {
      rectangle = image.viewportToImageRectangle(rectangle);
    }
    onChangeRef.current({ rectangle, image });
  }, [viewer, image, inImage, onChangeRef, state.rectangle]);

  const rectangle = useMemo(() => findRectangle(state), [state]);

  return (
    <Overlay rectangle={rectangle} viewportCoordinates>
      <div
        style={{
          border: "2px solid red",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            color: "red"
          }}
        >
          x
        </div>
      </div>
    </Overlay>
  );
}

function windowStateReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return {
        sliding: false,
        rectangle: action.defaultRectangle
      };
    case "CHANGE_SIZE":
      const xSizeDifference = action.width - state.rectangle.width;
      const ySizeDifference = action.height - state.rectangle.height;
      return {
        ...state,
        rectangle: {
          x: state.rectangle.x - xSizeDifference / 2,
          y: state.rectangle.y - ySizeDifference / 2,
          width: action.width,
          height: action.height
        }
      };
    case "PRESS":
      if (inside(state.rectangle, action.position)) {
        return {
          ...state,
          sliding: true,
          startPosition: action.position,
          endPosition: action.position
        };
      }
      return state;
    case "DRAG":
      if (state.sliding) {
        return {
          ...state,
          endPosition: { x: action.position.x, y: action.position.y }
        };
      }
      return state;
    case "DRAGEND":
      if (state.sliding) {
        return {
          sliding: false,
          rectangle: findRectangle(state)
        };
      }
      return state;
    default:
      return state;
  }
}

export function WindowSelector({ size, onChange }) {
  const { viewer } = useContext(DeepZoomAreaContext);
  const { image, inImage } = useContext(ImageContext);
  const [state, dispatch] = useReducer(windowStateReducer, null, () =>
    windowStateReducer(undefined, {
      type: "INIT",
      defaultRectangle: inImage
        ? image.imageToViewportRectangle(
            new OpenSeadragon.Rect(
              image.getContentSize().x / 2 - size.width / 2,
              image.getContentSize().y / 2 - size.height / 2,
              size.width,
              size.height
            )
          )
        : new OpenSeadragon.Rect(
            0.5 - size.width / 2,
            0.5 - size.height / 2,
            size.width,
            size.height
          )
    })
  );

  useEffect(() => {
    const { x: width, y: height } = inImage
      ? image.imageToViewportCoordinates(size.width, size.height)
      : { x: size.width, y: size.height };

    dispatch({ type: "CHANGE_SIZE", width, height });
  }, [inImage, image, size.width, size.height]);

  useMouseEvents(viewer, dispatch);

  const onChangeRef = useCallbackRef(onChange);

  useEffect(() => {
    let rectangle = new OpenSeadragon.Rect(
      state.rectangle.x,
      state.rectangle.y,
      state.rectangle.width,
      state.rectangle.height
    );
    if (inImage) {
      rectangle = image.viewportToImageRectangle(rectangle);
    }
    onChangeRef.current({ rectangle, image });
  }, [viewer, image, inImage, onChangeRef, state.rectangle]);

  const rectangle = useMemo(() => findRectangle(state), [state]);

  return (
    <Overlay rectangle={rectangle} viewportCoordinates>
      <div
        style={{
          border: "2px solid red",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            color: "red"
          }}
        >
          x
        </div>
      </div>
    </Overlay>
  );
}

export function useIsFullScreen(viewer) {
  const [fullScreen, setFullScreen] = React.useState(
    OpenSeadragon.isFullScreen()
  );
  React.useEffect(() => {
    if (!viewer) return;

    function setFullScreenValue({ fullScreen: newVal }) {
      setFullScreen(newVal);
    }
    viewer.addHandler("full-screen", setFullScreenValue);
    return () => viewer.removeHandler("full-screen", setFullScreenValue);
  }, [viewer]);
  return fullScreen;
}

function useMouseEvents(viewer, dispatch) {
  useEffect(() => {
    const panVerticalOriginal = viewer.panVertical;
    const panHorizontalOriginal = viewer.panHorizontal;
    const flickOriginal = viewer.gestureSettingsTouch.flickEnabled;

    function disableViewerPan() {
      viewer.panVertical = false;
      viewer.panHorizontal = false;
      viewer.gestureSettingsTouch.flickEnabled = false;
    }

    function enableViewerPan() {
      viewer.panVertical = panVerticalOriginal;
      viewer.panHorizontal = panHorizontalOriginal;
      viewer.gestureSettingsTouch.flickEnabled = flickOriginal;
    }

    function pressHandler(event) {
      dispatch({
        type: "PRESS",
        position: viewer.viewport.pointFromPixel(event.position)
      });
      disableViewerPan();
    }

    const dragHandler = throttle(30, function(event) {
      dispatch({
        type: "DRAG",
        position: viewer.viewport.pointFromPixel(event.position)
      });
    });

    function dragEndHandler(event) {
      dispatch({
        type: "DRAGEND",
        position: viewer.viewport.pointFromPixel(event.position)
      });
      enableViewerPan();
    }

    viewer.addHandler("canvas-press", pressHandler);
    viewer.addHandler("canvas-drag", dragHandler);
    viewer.addHandler("canvas-drag-end", dragEndHandler);

    return () => {
      viewer.removeHandler("canvas-press", pressHandler);
      viewer.removeHandler("canvas-drag", dragHandler);
      viewer.removeHandler("canvas-drag-end", dragEndHandler);
    };
  }, [viewer, dispatch]);
}
