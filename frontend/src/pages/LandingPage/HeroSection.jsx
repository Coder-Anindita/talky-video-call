import hero from "../../assets/VideoCallLanding.svg"

function HeroSection() {
  return (
    <div className="container-fluid">
        <div className="row align-items-center px-5">
            <div className="col-lg-6 col-sm-12 d-flex justify-content-center">
                <div className="text-center text-lg-start">
                    <h1 style={{ fontSize: "37px", fontWeight: "600" }} className="text-center pt-4">
                        Simple. Secure. Seamless communication.
                    </h1>
                    <p className="mt-3 text-center text-muted fs-5">
                        Communication. Simplified. With Talky.
                    </p>
                    <div className="d-flex justify-content-center ">
                        <p className="text-center px-4 py-2 rounded get-started" >Get started</p>
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-sm-12 px-5">
                <img src={hero} ></img>
            </div>


        </div>

    </div>
    
  )
}

export default HeroSection