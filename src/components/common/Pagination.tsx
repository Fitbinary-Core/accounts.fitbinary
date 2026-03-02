import "../../app/pagination.css";
import { BsThreeDots } from "react-icons/bs";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import React from "react";

interface PaginationProps {
  total?: number;
  initialPage?: number;
  page?: number;
  withEdges?: boolean;
  withControls?: boolean;
  getControlProps?: (
    control: "first" | "previous" | "next" | "last",
  ) => React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextIcon?: React.ReactNode;
  previousIcon?: React.ReactNode;
  firstIcon?: React.ReactNode;
  lastIcon?: React.ReactNode;
  dotsIcon?: React.ReactNode;
  gap?: number;
  hideWithOnePage?: boolean;
  onChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total = 1,
  initialPage = 1,
  page = 1,
  withEdges = false,
  withControls = true,
  getControlProps = () => ({}),
  nextIcon = "Nxt",
  previousIcon = "Pre",
  firstIcon = <MdKeyboardDoubleArrowLeft />,
  lastIcon = <MdKeyboardDoubleArrowRight />,
  dotsIcon = <BsThreeDots />,
  gap = 2,
  hideWithOnePage = false,
  onChange = () => {},
}) => {
  const currentPage = page || initialPage;

  if (hideWithOnePage && total === 1) {
    return null;
  }

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > total) return;
    onChange(newPage);
  };

  const renderDots = (key: string) => (
    <span key={key} className="pagination-dots">
      {dotsIcon}
    </span>
  );

  const renderPages = () => {
    const pages: React.ReactElement[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - currentPage) <= 1) {
        pages.push(
          <button
            key={i}
            className={`pagination-control ${
              i === currentPage ? "active" : ""
            }`}
            onClick={() => changePage(i)}
          >
            {i}
          </button>,
        );
      } else if (
        (i === currentPage - 2 || i === currentPage + 2) &&
        !pages.some((p) => p.key === `dots-${i}`)
      ) {
        pages.push(renderDots(`dots-${i}`));
      }
    }
    return pages;
  };

  return (
    <div className="pagination-root text-gray-800" style={{ gap }}>
      {withEdges && (
        <button
          {...getControlProps("first")}
          className="pagination-control"
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
        >
          {firstIcon}
        </button>
      )}

      {withControls && (
        <button
          {...getControlProps("previous")}
          className="pagination-control"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {typeof previousIcon === "string" ? (
            <p className="font-bold">{previousIcon}</p>
          ) : (
            previousIcon
          )}
        </button>
      )}

      {renderPages()}

      {withControls && (
        <button
          {...getControlProps("next")}
          className="pagination-control"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === total}
        >
          {typeof nextIcon === "string" ? (
            <p className="font-bold">{nextIcon}</p>
          ) : (
            nextIcon
          )}
        </button>
      )}

      {withEdges && (
        <button
          {...getControlProps("last")}
          className="pagination-control"
          onClick={() => changePage(total)}
          disabled={currentPage === total}
        >
          {lastIcon}
        </button>
      )}
    </div>
  );
};

export default Pagination;
