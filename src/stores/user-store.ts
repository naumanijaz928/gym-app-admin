// import { persist } from "zustand/middleware";
// import { createStore } from "zustand/vanilla";
// export type User = {
//   email: string;
//   firstName: string | null;
//   lastName: string | null;
//   phone: string;
//   phoneCode: string;
//   hearUs: string | null;
//   termsAccepted: boolean;
//   newsletterSubscribed: boolean;
//   otp: string | null;
//   accessToken: string;
//   refreshToken: string;
//   role: string;
// };
// export type UserState = {
//   user: User;
//   progress: number;
// };

// export type UserActions = {
//   setUser: (user: Partial<User>) => void; // Update user object
//   resetUser: () => void; // Reset user to default state
//   setProgress: (progress: number) => void; // Update progress
// };

// export type UserStore = UserState & UserActions;

// export const defaultUserState: UserState = {
//   user: {
//     email: "",
//     firstName: null,
//     lastName: null,
//     phone: "",
//     phoneCode: "",
//     hearUs: null,
//     termsAccepted: false,
//     newsletterSubscribed: false,
//     otp: null,
//     accessToken: "",
//     refreshToken: "",
//     role: "",
//   },
//   progress: 1,
// };

// export const createUserStore = (initState: UserState = defaultUserState) => {
//   return createStore<UserStore>()(
//     persist(
//       (set) => ({
//         ...initState,
//         setUser: (user) =>
//           set((state) => ({
//             user: { ...state.user, ...user }, // Merge new user data with existing user state
//           })),
//         resetUser: () =>
//           set(() => ({
//             ...defaultUserState,
//           })),
//         setProgress: (progress) =>
//           set(() => ({
//             progress,
//           })),
//       }),
//       {
//         name: "user-store", // Key for localStorage
//         partialize: (state) => ({ user: state.user }), // Persist only the `user` object
//       },
//     ),
//   );
// };
