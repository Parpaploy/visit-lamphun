import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowForward } from "react-icons/io";

export default function ItemMenu({
  title,
  desc,
  imgUrl,
  detailScrollRef,
}: {
  title: string;
  desc: string;
  imgUrl: string;
  detailScrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();

  const descRef = useRef<HTMLDivElement>(null);

  const [isClamped, setIsClamped] = useState<boolean>(false);
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const check = () => {
      setIsClamped(el.scrollHeight > el.clientHeight);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, [desc]);

  const smoothScrollTo = (
    container: HTMLElement,
    target: number,
    duration = 400,
  ) => {
    const start = container.scrollTop;
    const change = target - start;
    const startTime = performance.now();

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOut(progress);

      container.scrollTop = start + change * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="relative w-full border-b-2 border-[#D9D9D9] flex justify-start items-stretch gap-x-5 py-5">
      <div className="w-[30%] shrink-0 self-start aspect-square rounded-[18px] overflow-hidden">
        <img className="w-full h-full" src={imgUrl} loading="lazy" />
      </div>

      <div className="w-[70%] flex flex-col justify-between items-end gap-3">
        <div className="w-full text-start">
          <p className="text-[16px] font-medium">{title}</p>
          <p
            ref={descRef}
            className={`${showFullDesc ? "" : "line-clamp-2"} text-[12px] font-medium text-[#543A14] pt-1`}
          >
            {desc}
          </p>
        </div>

        {(isClamped || showFullDesc) && (
          // <button
          //   onClick={() => {
          //     setShowFullDesc((prev) => {
          //       const next = !prev;

          //       // if (!prev) {
          //       //   setTimeout(() => {
          //       //     const container = detailScrollRef.current;
          //       //     const el = descRef.current;

          //       //     if (container && el) {
          //       //       const containerRect =
          //       //         container.getBoundingClientRect();
          //       //       const elRect = el.getBoundingClientRect();

          //       //       const offset =
          //       //         elRect.top -
          //       //         containerRect.top +
          //       //         container.scrollTop;

          //       //       const target =
          //       //         offset -
          //       //         container.clientHeight / 2 +
          //       //         el.clientHeight / 2;

          //       //       smoothScrollTo(container, target, 250);
          //       //     }
          //       //   }, 50);
          //       // }

          //       if (!prev) {
          //         requestAnimationFrame(() => {
          //           requestAnimationFrame(() => {
          //             const container = detailScrollRef.current;
          //             const el = descRef.current;

          //             if (container && el) {
          //               const containerRect = container.getBoundingClientRect();
          //               const elRect = el.getBoundingClientRect();

          //               const offset =
          //                 elRect.top - containerRect.top + container.scrollTop;

          //               const maxScroll =
          //                 container.scrollHeight - container.clientHeight;

          //               // const OFFSET = 15;

          //               // const target = Math.max(
          //               //   0,
          //               //   Math.min(offset - OFFSET, maxScroll),
          //               // );

          //               const target = Math.max(
          //                 0,
          //                 Math.min(
          //                   offset -
          //                     container.clientHeight / 2 +
          //                     el.clientHeight / 2,
          //                   maxScroll,
          //                 ),
          //               );

          //               smoothScrollTo(container, target, 220);
          //             }
          //           });
          //         });
          //       }

          //       return next;
          //     });
          //   }}
          //   className="absolute bottom-3 right-0 z-50 mx-auto font-bold text-[#F48B3C] text-[14px] flex justify-center items-center gap-1"
          // >
          //   {t("homepage.readMore")} <IoIosArrowForward />
          // </button>

          <button
            onClick={() => {
              setShowFullDesc((prev) => {
                const next = !prev;

                // if (!prev) {
                //   setTimeout(() => {
                //     const container = detailScrollRef.current;
                //     const el = descRef.current;

                //     if (container && el) {
                //       const containerRect =
                //         container.getBoundingClientRect();
                //       const elRect = el.getBoundingClientRect();

                //       const offset =
                //         elRect.top -
                //         containerRect.top +
                //         container.scrollTop;

                //       const target =
                //         offset -
                //         container.clientHeight / 2 +
                //         el.clientHeight / 2;

                //       smoothScrollTo(container, target, 250);
                //     }
                //   }, 50);
                // }

                if (!prev) {
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      const container = detailScrollRef.current;
                      const el = descRef.current;

                      if (container && el) {
                        const containerRect = container.getBoundingClientRect();
                        const elRect = el.getBoundingClientRect();

                        const offset =
                          elRect.top - containerRect.top + container.scrollTop;

                        const maxScroll =
                          container.scrollHeight - container.clientHeight;

                        // const OFFSET = 15;

                        // const target = Math.max(
                        //   0,
                        //   Math.min(offset - OFFSET, maxScroll),
                        // );

                        const target = Math.max(
                          0,
                          Math.min(
                            offset -
                              container.clientHeight / 2 +
                              el.clientHeight / 2,
                            maxScroll,
                          ),
                        );

                        smoothScrollTo(container, target, 220);
                      }
                    });
                  });
                }

                return next;
              });
            }}
            className="font-bold text-[#F48B3C] text-[14px] flex justify-center items-center gap-1"
          >
            {t("homepage.readMore")} <IoIosArrowForward />
          </button>
        )}
      </div>

      {/* <div className="absolute bottom-3 right-0 text-[12px] border border-[#BF4B17] rounded-full px-3 bg-white">
        {t("menu.more")}
      </div> */}
    </div>
  );
}
