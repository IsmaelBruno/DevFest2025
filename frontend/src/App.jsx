import { BrowserRouter as Router } from "react-router-dom";
import RoutesApplication from "./config/routes/mainRoutes";
import { AudioProvider } from "./config/audio/AudioContext";
import SpeedDial from "./Components/SpeedDial/SpeedDial";
import ClickSpark from "./Components/ClickSpark/Click";
import ScrollToTop from "./ui/scrollToTop/scrollToTop";
import FloatingCursor from "./Components/FloatingCursor/FloatingCursor";
import './App.scss'

function App() {
  return (
    <>
      <FloatingCursor />
      <ClickSpark
        sparkColor='#047185'
        sparkSize={15}
        sparkRadius={25}
        sparkCount={12}
        duration={600}
      >
        <AudioProvider>
          <Router>
            <ScrollToTop />
            <RoutesApplication />
            <SpeedDial /> {/* ✅ Maintenant dans le Router */}
          </Router>
        </AudioProvider>
      </ClickSpark>
    </>
  )
}

export default App
