// // const fruits = ["apple","mango","papaya","orange"]


// // const item = fruits.find((fruit)=>fruit === "orange")
// // // const item = fruits.some((fruit)=>fruit === "orange")
// // // const item = fruits.findIndex((fruit)=>fruit === "orange")
// // // const item = fruits.every((fruit)=>fruit === "orange")

// // console.log(item)
// // console.log(fruits[item])

// // const fruits = ["apple", "mango", "papaya", "orange"];

// // largestString(fruits);
// // function largestString(arr) {
// //   let str = "";
// //   for (const a of arr) {
// //     if (a > str) {
// //       str = a;
// //     }
// //   }
// //   console.log(str)
// // }
// // function largestString(arr){
// //   // reverse every string in the array
// //   const reversedArr = arr.map(str => str.split('').reverse().join(''));
// //   // find the largest string in the reversed array
// //   let largest = "";
// //   for (const str of reversedArr) {
// //     if (str > largest) {
// //       largest = str;
// //     }
// //   }
// //   // reverse the largest string to get the original string
// //   const originalLargest = largest.split('').reverse().join("");
// //   console.log(originalLargest);

// // }

// function getData() {
//   try {
//     console.log("hello1");
//       throw Error("hhihi")


//     try {
//       console.log("inner try");
//       // throw Error("hello")
//     } catch (error) {
//       return console.error("inner catch error",error);
//     }
  
//   } catch (error) {
//     console.log("parent error:",error);
//   }
//   console.log("hello3");
// }

// getData()

// const arr = [5,6,4,2,4,0,5,4,45,1,46,99]

// largestNumber(arr)
// function largestNumber(arr){
//   let largest = ""

//   // for (let a of arr){
//   //   if(a > largest){
//   //     largest = a
//   //   }
//   // }
//   //  find the smallest number in the array
//   // for (let a of arr){
//   //   if(a < largest || largest === ""){
//   //     largest = a
//   //   }
//   // }

//   // console.log(largest)
// }