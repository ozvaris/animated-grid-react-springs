import { Box, Paper, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import "./styles.css";
import { animated, useTransition, useSprings, a } from "@react-spring/web";
// import Masonry from "@mui/lab/Masonry";
import useMedia from "./useMedia";
import useMeasure from "react-use-measure";
// import * as styles from "./styles.module.css";
import Tile from "./Tile";

export default function App() {
  const css = `.list {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .list > div {
    position: absolute;
    will-change: transform, width, height, opacity;
  }
  
  .list > div > div {
    position: relative;
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-transform: uppercase;
    font-size: 10px;
    line-height: 10px;
    border-radius: 4px;
    box-shadow: 0px 10px 50px -10px rgba(51, 51, 51, 0.2);
  }`;
  const dataArr = [];
  for (let index = 0; index < 15; index++) {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    console.log;
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    const rgb = `rgb(${r},${g},${b})`;
    dataArr.push({ index, rgb });
  }
  const [arr, setArr] = useState(dataArr);
  const [itemIndex, setItemIndex] = useState(-1);
  const [isDelayed, setIsDelayed] = useState(true);

  const to = (i: number) => ({
    opacity: itemIndex === i ? 0 : 1,
    delay: isDelayed ? i * 100 : 0
  });
  const from = (i: number) => ({ opacity: itemIndex === i ? 1 : 0 });

  const AnimatedItem = animated(Paper);
  const [props, api] = useSprings(arr.length, (i) => ({
    ...to(i),
    from: from(i)
  }));

  // Hook1: Tie media queries to the number of columns
  const columns = useMedia(
    [
      "(min-width: 1500px)",
      "(min-width: 1000px)",
      "(min-width: 600px)",
      "(min-width: 400px)"
    ],
    [5, 3, 3, 1],
    1
  );
  // Hook2: Measure the width of the container element
  const [ref] = useMeasure();

  const height = 250;
  const basePadding = 10;

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let lastWidth = 0;
    let maxRows = Math.ceil(arr.length / columns);
    if (maxRows * columns !== arr.length) {
      maxRows += 1;
    }
    let currentRow = 0;
    let gridItems = arr.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const itemWidth = i % 2 === 0 ? height : height * 2;
      const x = lastWidth; // x = container width / number of columns * column index,

      const y = (heights[column] += height) + currentRow * basePadding - height; // y = it's just the height of the current column

      lastWidth = lastWidth + itemWidth + basePadding;
      if ((i + 1) % columns === 0) {
        lastWidth = 0;
        if (currentRow < maxRows - 1) currentRow += 1;
      }

      if (currentRow > maxRows) {
        currentRow = maxRows - 1;
      }

      return { ...child, x, y, width: itemWidth, height: height };
    });
    return [heights, gridItems];
  }, [columns, arr]);
  // Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, {
    key: (item: { index: number; rgb: string }) => item.index,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25
  });

  return (
    <Box sx={{ width: "100%" }}>
      <style>{css}</style>
      <div ref={ref} className="list" style={{ height: Math.max(...heights) }}>
        {transitions((style, item, t, i) => (
          <a.div style={style}>
            <Tile
              item={item}
              onDelete={() => {
                const filteredArray = arr.filter(
                  (itm) => itm.index !== item.index
                );
                setArr(filteredArray);
              }}
            />
          </a.div>
        ))}
      </div>
    </Box>
  );
}
