import React, { useState } from 'react'
import { Carousel, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const CustomCarouselControl = ({ direction, onClick }) => {
  const isNext = direction === 'next'
  
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [isNext ? 'right' : 'left']: '15px',
        zIndex: 10,
        width: '50px',
        height: '50px',
        backgroundColor: 'rgba(52, 73, 94, 0.8)',
        border: 'none',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '20px',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(52, 73, 94, 1)'
        e.target.style.transform = 'translateY(-50%) scale(1.1)'
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(52, 73, 94, 0.8)'
        e.target.style.transform = 'translateY(-50%) scale(1)'
        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      {isNext ? '❯' : '❮'}
    </button>
  )
}

const TutorialPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const tutorialSteps = [
    {
      id: 1,
      image: '/bpm-elf/tutorial-step1.png',
      title: '步驟 1：啟動並選擇單據類型',
      description: '從導航選單中選擇您要填寫的 BPM 單據，系統會自動載入對應的表單模板'
    },
    {
      id: 2,
      image: '/bpm-elf/tutorial-step1.png',
      title: '步驟 2：建立及複製需求內容',
      description: '填寫表單資訊後按下建立及複製需求內容至剪貼簿'
    },
    {
      id: 3,
      image: '/bpm-elf/tutorial-step1.png',
      title: '步驟 3：貼上至 BPM',
      description: '修改至滿意後把最終內容複製並貼上 BPM 需求單'
    }
  ]

  const handlePrevSlide = () => {
    setActiveIndex(activeIndex === 0 ? tutorialSteps.length - 1 : activeIndex - 1)
  }

  const handleNextSlide = () => {
    setActiveIndex(activeIndex === tutorialSteps.length - 1 ? 0 : activeIndex + 1)
  }

  return (
    <div style={{ 
      // height: '100vh', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* 主標題區域 - 獨立在最上方 */}
      <div className="text-center py-3" style={{ 
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/bpm-elf/magician-hat512.png"
            alt="BPM ELF Logo"
            style={{
              width: '40px',
              height: '40px',
              marginRight: '12px'
            }}
          />
          <p style={{
            fontWeight: '400',
            color: '#34495e',
            fontSize: '1.1rem',
            lineHeight: '1.5',
            margin: 0
          }}>
            三個簡單步驟，開啟您的高效開單之旅
          </p>
        </div>
      </div>

      {/* Carousel 教學區域 - 完全置中 */}
      <Container fluid style={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Row className="justify-content-center w-100">
          <Col lg={10} xl={10}>
            <div style={{ position: 'relative' }}>
              <Carousel
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                interval={5000}
                controls={false}
                indicators={true}
                style={{ 
                  maxHeight: '70vh',
                  width: '100%'
                }}
              >
            {tutorialSteps.map((step, index) => (
              <Carousel.Item key={step.id}>
                {/* 圖片區域 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px 12px 0 0',
                    height: '50vh',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                </div>

                {/* 文字說明區域 */}
                <Carousel.Caption
                  style={{
                    position: 'static',
                    padding: '1.5rem',
                    borderRadius: '0 0 12px 12px'
                  }}
                >
                  <h3 style={{
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '1rem',
                    fontSize: '1.5rem'
                  }}>
                    {step.title}
                  </h3>
                  <div style={{
                    margin: '0 auto',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#7f8c8d'
                  }}>
                    <p className="mb-0">
                      {step.description}
                    </p>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
              
              <CustomCarouselControl 
                direction="prev" 
                onClick={handlePrevSlide}
              />
              <CustomCarouselControl 
                direction="next" 
                onClick={handleNextSlide}
              />
            </div>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default TutorialPage
