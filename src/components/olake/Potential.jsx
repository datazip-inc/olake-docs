// import React from "react";

// const data = [
//   {
//     image: "/img/olake/potential-1.svg",
//     heading: "Faster Parallel &  Full Load",
//     subHeading:
//       "Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel.",
//   },
//   {
//     image: "/img/olake/potential-2.svg",
//     heading: "CDC cursor preservation",
//     subHeading:
//       "When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication.",
//   },
//   {
//     image: "/img/olake/potential-3.svg",
//     heading: "Optimized Data Pull",
//     subHeading:
//       "Instead of directly transforming data from MongoDB during extraction, we first pull it in its native BSON format (Binary JSON, MongoDB's data format, which stores JSON-like documents more efficiently). Once we have the data, we decode it on the ETL side.",
//   },
//   {
//     image: "/img/olake/potential-4.svg",
//     heading: "Efficient Incremental Sync",
//     subHeading:
//       "Using MongoDB's change streams enables parallel updates for each collection. This method facilitates rapid synchronisation and ensures that data is consistently updated with near real-time updates.",
//   },
// ];

// const Potential = () => {
//   return (
//     <div className="flex flex-col max-w-[90%] mt-[80px] mx-auto">
//       {/* Heading */}
//       <div className="text-white text-[40px] font-normal leading-[50px] max-w-[800px] text-center self-center">
//         <span className="font-semibold">Unlock the</span> full potential{" "}
//         <span className="font-semibold">of Database replication with</span> O
//         <span className="font-semibold">Lake</span>
//       </div>
//       {/* Grid */}
//       <div className="grid grid-cols-8 gap-4 mt-[50px]">
//         {data.map((val, index) => {
//           // Set grid span based on index to replicate the original layout:
//           // Item 1 (index 0): grid-column: 1 / 4  -> span 3
//           // Item 2 (index 1): grid-column: 4 / 9  -> span 5
//           // Item 3 (index 2): grid-column: 1 / 5  -> span 4
//           // Item 4 (index 3): grid-column: 5 / 9  -> span 4
//           let spanClass = "";
//           if (index === 0) spanClass = "col-span-3";
//           else if (index === 1) spanClass = "col-span-5";
//           else if (index === 2) spanClass = "col-span-4";
//           else if (index === 3) spanClass = "col-span-4";

//           return (
//             <div
//               key={index}
//               className={`${spanClass} flex flex-col items-start rounded-[8px] bg-[#171717] p-[24px]`}
//             >
//               <img
//                 src={val.image}
//                 alt="potential img"
//                 className="max-h-[90px] object-contain"
//               />
//               <div className="text-white text-[20px] font-semibold mt-[28px]">
//                 {val.heading}
//               </div>
//               <div className="text-[#c6c6c6] text-[14px] font-normal mt-[10px]">
//                 {val.subHeading}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Potential;
