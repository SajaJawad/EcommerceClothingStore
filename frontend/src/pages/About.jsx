import React from "react";
import Title from "./../components/Title";
import { assets } from "./../assets/assets";
import NewsletterBox from './../components/NewsletterBox';

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo
            expedita veniam illo totam eligendi libero ad modi, quasi aspernatur
            deleniti itaque, optio hic maiores. Consequuntur alias facilis ipsam
            deleniti incidunt?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime
            accusantium debitis voluptatum magni nesciunt deserunt error laborum
            facilis delectus magnam! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Repudiandae, doloremque perferendis iste eligendi
            illum perspiciatis nisi modi dolorum adipisci error!
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
            fugiat, itaque vero, aliquam quibusdam deserunt nulla nostrum eum
            mollitia totam alias, adipisci consequatur debitis similique
            obcaecati pariatur accusamus assumenda ipsum?
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm md-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni a
            assumenda culpa animi soluta libero expedita dolores alias est
            molestiae?
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, praesentium? Amet architecto ut at asperiores. Facere ut incidunt voluptatum blanditiis? culpa animi soluta libero expedita dolores alias est
            molestiae?
          </p>
        </div>
                <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Service:</b>
          <p className="text-gray-600"> sit amet consectetur adipisicing elit. Magni a assumenda culpa animi soluta libero expedita dolores alias est molestiae?</p>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  );
};

export default About;
