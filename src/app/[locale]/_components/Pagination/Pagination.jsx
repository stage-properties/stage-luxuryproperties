"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import LeftArrow from "../../../../../assets/Icons/leftArrow.svg";
import RightArrow from "../../../../../assets/Icons/rightArrow.svg";
import { useWindowWidth } from "@react-hook/window-size";
import { useLocale } from 'next-intl';

const Pagination = ({ pageDetails, searchParams }) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  // Utility function to convert digits
  const convertToArabicDigits = (num) => {
    const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(num).replace(/\d/g, digit => arabicDigits[parseInt(digit, 10)]);
  };

  const windowSize = useWindowWidth();
  const [paginationCount, setPaginationCount] = useState(3);

  const pathname = usePathname();
  const router = useRouter();

  // Determine if it's the first page
  const isFirstPage = !pathname.split("/").pop().includes("page");
  const lastURLSegment = pathname.split("/").pop();
  const currentPage = isFirstPage ? 1 : Number(lastURLSegment.split("-")[1]);

  // Adjust paginationCount based on window width
  useEffect(() => {
    if (windowSize < 361) {
      setPaginationCount(0);
    } else if (windowSize < 640) {
      setPaginationCount(2);
    } else {
      setPaginationCount(3);
    }
  }, [windowSize]);

  // Convert pagination numbers to Arabic-Indic digits after rendering
  useEffect(() => {
    if(!isRTL) return;
    const paginationItems = document.querySelectorAll('.paginationContainer li a');
    paginationItems.forEach(item => {
      const text = item.textContent.trim();
      // Check if the text is a number
      if (/^\d+$/.test(text)) {
        const arabicNumber = convertToArabicDigits(text);
        item.textContent = arabicNumber;
      }
    });
  }, [pageDetails, currentPage, isRTL]);

  // If there's only one page, do not render pagination
  if (pageDetails?.pageCount <= 1) {
    return null;
  }

  // Helper function to remove the last item from an array
  const removeLastItem = (arr) => {
    if (arr.length > 0) {
      return arr.slice(0, -1);
    }
    return [];
  };

  // Build the base URL for pagination
  const replacedWithPage = !isFirstPage
    ? removeLastItem(pathname.split("/")).join("/")
    : "";

  const redirectURL = isFirstPage
    ? `${lastURLSegment}/page`
    : "page";

  // Handle page click event
  const handlePageClick = (selectedItem) => {
    const page = selectedItem.selected + 1;

    // Scroll behavior based on presence of search form
    const offplanSearchFormDOM = document.getElementById('searchForm');
    if (!offplanSearchFormDOM) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      offplanSearchFormDOM.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Build the new URL based on searchParams
    if (!searchParams) {
      if (page === 1) {
        router.push(`${replacedWithPage}`, { scroll: false });
      } else {
        router.push(`${redirectURL}-${page}`, { scroll: false });
      }
      return;
    }

    const searchParamsToString = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const newURL = `${redirectURL}-${page}?${searchParamsToString}`;
    router.push(`${newURL}`, { scroll: false });
  };

  return (
    <div className="paginationContainer" dir={direction}>
      <ReactPaginate
        breakLabel="..."
        nextLabel={isRTL ? <LeftArrow/> : <RightArrow />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={Number(pageDetails?.pageCount)}
        previousLabel={isRTL ? <RightArrow/> : <LeftArrow />}
        renderOnZeroPageCount={null}
        forcePage={currentPage - 1}
        marginPagesDisplayed={paginationCount}
        containerClassName={"pagination"}
        pageClassName={"paginationItem"}
        pageLinkClassName={"paginationLink"}
        previousClassName={"paginationPrev"}
        nextClassName={"paginationNext"}
        breakClassName={"paginationBreak"}
      />
    </div>
  );
};

export default Pagination;