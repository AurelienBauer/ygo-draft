import React, { useEffect, useState, ReactElement } from "react";
import "./VerticalRotateList.css";

interface Config {
  visibleItem: number;
}

interface PropsGroup {
  children: ReactElement[];
  config?: Config;
  value: string;
}

const defaultConfig: Config = {
  visibleItem: 3,
};

const VerticalRotateListGroup = (props: PropsGroup) => {
  const { children, value, config } = props;
  const conf = { ...defaultConfig, ...config };

  const [list, setList] = useState<ReactElement[]>(children);
  const [slide, setSlide] = useState(false);

  const shiftList = () => {
    if (list.length) {
      const newList = [...list];
      const firstChild = newList.shift();
      if (firstChild) {
        newList.push(firstChild);
      }
      setList(newList);
    }
  };

  const expandList = (list: ReactElement[]): ReactElement[] => {
    const expandedList = [...list];
    const elementToAdd = conf.visibleItem + 2 - children.length;

    for (let i = 0; i < elementToAdd; i++) {
      if (i % 2 === 1) {
        expandedList.push(expandedList[i]);
      } else {
        expandedList.unshift(expandedList[expandedList.length - 1 - i]);
      }
    }
    return expandedList;
  };

  const hasSelectedItemThisValue = (value: string): boolean => {
    const middleIndex = Math.floor(list.length / 2) - (list.length % 2 ? 0 : 1);
    return list[middleIndex] && list[middleIndex].props?.value === value;
  };

  const handleAnnimationEnds = () => {
    setSlide(false);
    shiftList();
  };

  useEffect(() => {
    const shiftLiftAnnimation = () => {
      if (!hasSelectedItemThisValue(value)) {
        setTimeout(() => setSlide(true), 1000);
      }
    };
    shiftLiftAnnimation();
  }, [value, list]);

  return (
    <ul
      className={`ListBox ${slide ? "SlideDown" : ""}`}
      onAnimationEnd={handleAnnimationEnds}
    >
      {expandList(list).map((elem: ReactElement, i: number) =>
        React.cloneElement(elem, { key: i })
      )}
    </ul>
  );
};

interface PropsItem {
  text: string;
  selected?: boolean;
  value: string;
}

const VerticalRotateListItem = (props: PropsItem) => {
  const { text } = props;
  return <li className="ListItem">{text}</li>;
};

export { VerticalRotateListGroup, VerticalRotateListItem };
