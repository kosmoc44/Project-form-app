import Image from "next/image"
import hero from '../../public/hero.svg'
import { Button } from "../../components/ui/button"


function Hero() {
    return (
        <section className=" lg:grid  lg:place-content-center">
            <div
                className="mx-auto w-screen max-w-screen-xl px-4 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
            >
                <div className="max-w-prose text-left">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Create UI forms faster
                        <strong className="text-indigo-600"> for </strong>
                        developers
                    </h1>

                    <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
                        accusamus impedit minima harum corporis iusto.
                    </p>

                    <div className="mt-4 flex gap-4 sm:mt-6">
                        <Button className="border-indigo-600 bg-indigo-600    hover:bg-indigo-700">
                            Get started
                        </Button>

                        <Button variant={"outline"}>
                            Learn More
                        </Button>
                    </div>
                </div>
                <Image src={hero} alt="herImg" />
            </div>
        </section >
    )
}

export default Hero
