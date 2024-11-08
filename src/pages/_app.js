import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@material-tailwind/react";
import { SharedProvider } from "@/sharedContext";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <SharedProvider>
        <Component {...pageProps} />
      </SharedProvider>
    </ThemeProvider>
  );
}
