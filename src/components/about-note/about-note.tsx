import React from 'react'
import { GrUserExpert } from "react-icons/gr";
import { MdLightbulbOutline } from "react-icons/md";
import { IoMedalOutline, IoPeopleOutline } from "react-icons/io5";
import { Card } from 'antd';
import "./about-note.scss";
import { useTranslation } from "@contexts/translation.context";

const AboutNote = () => {
  const { t } = useTranslation();

return (
    <>
     <div id="about" className="block padding-top mt-sm-0 pb-5">
        <div className="titleHolder">
          <h2>{t('about_note.title')}</h2>
          <p>
            {t('about_note.subtitle')}
          </p>
        </div>
        {}
        <div
          className="mx-auto  row"
          style={{ width: "85%", minHeight: "15rem" }}
        >
          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center bg-white"
            >
              <p className="fw-bold text-center">{t('about_note.expertise.title')}</p>
              <GrUserExpert
                className="mx-auto d-block"
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: "darkslategray",
                }}
              />
              <small className="d-block text-center">
                {t('about_note.expertise.description')}
              </small>
            </Card>
          </div>

<div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center bg-white"
            >
              <p className="fw-bold text-center">{t('about_note.innovation.title')}</p>
              <MdLightbulbOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#FFDF00" }}
              />

<small className="d-block text-center">
                {t('about_note.innovation.description')}
              </small>
            </Card>
          </div>

<div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center bg-white"
            >
              <p className="fw-bold text-center">{t('about_note.collaboration.title')}</p>
              <IoPeopleOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#00BFFF" }}
              />
              <small className="d-block text-center">
                {t('about_note.collaboration.description')}
              </small>
            </Card>
          </div>

<div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center bg-white"
            >
              <p className="fw-bold text-center">{t('about_note.excellence.title')}</p>
              <IoMedalOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#32CD32" }}
              />
              <small className="d-block text-center">
                {t('about_note.excellence.description')}
              </small>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutNote
