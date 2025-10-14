import Hero_1 from "./Hero_1/Hero_1";
import Hero_2 from "./Hero_2/Hero_2";
import Hero_3 from "./Hero_3/Hero_3";
import Hero_5 from "./Hero_5/Hero_5";

export default function LandingPage () {
    return(
        <div className="Landing-container">
            <Hero_5/>
            <Hero_2/>
            <Hero_1/>
            <Hero_3/>
        </div>
    )
}