import React from 'react'
import startTodayBack from "@/assets/images/start-today-back.png";
// import { NoiseTexture } from 'postprocessing';
import noiseTexture from "@/assets/images/textures.png";

const Faltu = () => {
    return (
        <div>
            <div
                className="relative rounded-2xl overflow-hidden px-8 py-13 text-center min-h-[300px]"
                // style={{
                //     backgroundImage: `url(${startTodayBack.src})`,
                //     backgroundSize: "cover",
                //     backgroundPosition: "center",
                // }}
            >
                {/* Dark base layer so text stays readable */}
                <div
                    className="absolute inset-0 -z-10 rounded-2xl"
                    style={{ background: "#060d1f" }}
                />

                {/* Noise Texture Overlay */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-5 "
                    style={{
                        backgroundImage: `url(${noiseTexture.src})`,
                        backgroundRepeat: 'repeat',
                        opacity: 0.5,
                        backgroundSize: '200px 200px'
                    }}
                />
            </div>
        </div>
    )
}

export default Faltu