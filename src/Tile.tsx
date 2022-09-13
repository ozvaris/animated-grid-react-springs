import { Paper, Typography } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";

interface IItemProps {
  index: number;
  rgb: string;
}

interface ISCreenProps {
  onDelete: () => void;
  item: IItemProps;
}

function Tiles({ item, onDelete }: ISCreenProps) {
  const [remove, setRemove] = useState(false);
  const styles = useSpring({ opacity: remove ? 0 : 1 });

  const AnimatedItem = animated(Paper);

  return (
    <AnimatedItem
      elevation={10}
      sx={{
        backgroundColor: item.rgb
      }}
      onClick={() => {
        setRemove(true);
        // api.start({ opacity: 0 });
        setTimeout(() => {
          onDelete();
        }, 400);
      }}
      style={styles}
    >
      <Typography py={10} variant="h4" textAlign="center" color="white">
        {`${item.index + 1}`}
      </Typography>
    </AnimatedItem>
  );
}

export default Tiles;
