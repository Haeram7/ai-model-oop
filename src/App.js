import React, { useState } from 'react';
import { CNNModel } from './models/CNNModel';
import { RNNModel } from './models/RNNModel';
import { TransformerModel } from './models/TransformerModel';
import { GANModel } from './models/GANModel';
import './App.css';

// 12개 인스턴스 정의
const MODEL_GROUPS = [
  {
    type: 'CNN',
    instances: [
      new CNNModel("CNN_Edge_Detector", 16, 3),
      new CNNModel("CNN_Vision_Pro", 64, 3),
      new CNNModel("CNN_Medical_Scans", 128, 5),
    ],
    inputFields: [
      { key: 'width', label: '이미지 가로 (px)', defaultValue: 224 },
      { key: 'height', label: '이미지 세로 (px)', defaultValue: 224 },
      { key: 'channels', label: '채널 수 (RGB=3)', defaultValue: 3 },
    ],
    getInput: (vals) => [Number(vals.width), Number(vals.height), Number(vals.channels)],
  },
  {
    type: 'RNN',
    instances: [
      new RNNModel("RNN_Small_Bot", 64),
      new RNNModel("RNN_Standard_Chat", 256),
      new RNNModel("RNN_Heavy_Translator", 1024),
    ],
    inputFields: [
      { key: 'sentence', label: '문장 입력 (스페이스로 토큰 분리)', defaultValue: 'I love deep learning' },
    ],
    getInput: (vals) => vals.sentence.trim().split(' '),
  },
  {
    type: 'Transformer',
    instances: [
      new TransformerModel("Transformer_Nano", 4, 2, 128),
      new TransformerModel("Transformer_Base", 8, 6, 512),
      new TransformerModel("Transformer_LLM", 16, 12, 1024),
    ],
    inputFields: [
      { key: 'sentence', label: '문장 입력 (스페이스로 토큰 분리)', defaultValue: 'The quick brown fox jumps' },
    ],
    getInput: (vals) => vals.sentence.trim().split(' '),
  },
  {
    type: 'GAN',
    instances: [
      new GANModel("GAN_Pixel_Art", 50, 128, 784),
      new GANModel("GAN_DeepFake_Base", 100, 256, 1024),
      new GANModel("GAN_HighRes_Gen", 256, 1024, 4096),
    ],
    inputFields: [
      { key: 'count', label: '생성할 이미지 개수', defaultValue: 5 },
    ],
    getInput: (vals) => Array(Number(vals.count)).fill('img'),
  },
];

const TYPE_COLORS = {
  CNN: '#2563eb',
  RNN: '#16a34a',
  Transformer: '#d97706',
  GAN: '#dc2626',
};

export default function App() {
  const [modal, setModal] = useState(null); // { group, instance }
  const [inputVals, setInputVals] = useState({});
  const [result, setResult] = useState(null);

  const openModal = (group, instance) => {
    const defaults = {};
    group.inputFields.forEach(f => { defaults[f.key] = f.defaultValue; });
    setModal({ group, instance });
    setInputVals(defaults);
    setResult(null);
  };

  const closeModal = () => {
    setModal(null);
    setResult(null);
  };

  const handleCalculate = () => {
    const { group, instance } = modal;
    const input = group.getInput(inputVals);
    const info = instance.introduce();
    const complexity = instance.calculateComplexity(input);
    const params = instance.calculateTotalParameters(input);
    setResult({ info, complexity, params, input });
  };

  return (
    <div className="app">
      <h1>AI Model OOP 시각화</h1>
      <p className="subtitle">모델 카드를 클릭하면 인스턴스를 선택하고 값을 입력할 수 있습니다</p>

      {/* 상속 구조 */}
      <div className="hierarchy">
        <div className="node adt">AIModelADT (추상)</div>
        <div className="arrow">↓</div>
        <div className="node base">BaseModel</div>
        <div className="arrow">↓</div>

        <div className="model-groups">
          {MODEL_GROUPS.map((group) => (
            <div key={group.type} className="group-col">
              <div className="group-label" style={{ borderColor: TYPE_COLORS[group.type], color: TYPE_COLORS[group.type] }}>
                {group.type}Model
              </div>
              {group.instances.map((instance) => (
                <div
                  key={instance.name}
                  className="instance-card"
                  style={{ borderColor: TYPE_COLORS[group.type] }}
                  onClick={() => openModal(group, instance)}
                >
                  {instance.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            {/* 공통 정보 */}
            <h2 style={{ color: TYPE_COLORS[modal.group.type] }}>{modal.instance.name}</h2>
            <div className="info-grid">
              <div className="info-item"><span className="label">고안자</span><span className="value">{modal.instance.introduce().proposedBy}</span></div>
              <div className="info-item"><span className="label">제안 연도</span><span className="value">{modal.instance.introduce().year}</span></div>
              <div className="info-item"><span className="label">핵심 메커니즘</span><span className="value">{modal.instance.introduce().coreMechanism}</span></div>

  {/* CNN 고유 정보 */}
  {modal.instance.introduce().outChannels && (
    <>
      <div className="info-item"><span className="label">필터 수 (out_channels)</span><span className="value">{modal.instance.introduce().outChannels}</span></div>
      <div className="info-item"><span className="label">커널 크기</span><span className="value">{modal.instance.introduce().kernelSize}</span></div>
      <div className="info-item"><span className="label">입력 타입</span><span className="value">{modal.instance.introduce().inputType}</span></div>
    </>
  )}

  {/* RNN 고유 정보 */}
  {modal.instance.introduce().hiddenStates && (
    <div className="info-item"><span className="label">은닉층 크기 (hidden_states)</span><span className="value">{modal.instance.introduce().hiddenStates}</span></div>
  )}

  {/* Transformer 고유 정보 */}
  {modal.instance.introduce().heads && (
    <>
      <div className="info-item"><span className="label">어텐션 헤드 수</span><span className="value">{modal.instance.introduce().heads}</span></div>
      <div className="info-item"><span className="label">레이어 수</span><span className="value">{modal.instance.introduce().layers}</span></div>
      <div className="info-item"><span className="label">은닉층 크기</span><span className="value">{modal.instance.introduce().hiddenSize}</span></div>
    </>
  )}

  {/* GAN 고유 정보 */}
  {modal.instance.introduce().latentDim && (
    <>
      <div className="info-item"><span className="label">노이즈 차원 (latent_dim)</span><span className="value">{modal.instance.introduce().latentDim}</span></div>
      <div className="info-item"><span className="label">출력 차원 (output_dim)</span><span className="value">{modal.instance.introduce().outputDim}</span></div>
      <div className="info-item"><span className="label">생성자 파라미터</span><span className="value">{modal.instance.introduce().paramsG}</span></div>
      <div className="info-item"><span className="label">판별자 파라미터</span><span className="value">{modal.instance.introduce().paramsD}</span></div>
    </>
  )}
</div>

            {/* 입력 */}
            <div className="input-section">
              <h3>입력값 설정</h3>
              {modal.group.inputFields.map((field) => (
                <div key={field.key} className="input-row">
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={inputVals[field.key] ?? field.defaultValue}
                    onChange={(e) => setInputVals({ ...inputVals, [field.key]: e.target.value })}
                  />
                </div>
              ))}
              <button className="calc-btn" style={{ backgroundColor: TYPE_COLORS[modal.group.type] }} onClick={handleCalculate}>
                계산하기
              </button>
            </div>

            {/* 결과 */}
            {result && (
              <div className="result-section">
                <div className="result-item highlight">
                  <span className="label">입력 데이터</span>
                  <span className="value">{JSON.stringify(result.input)}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">계산 복잡도</span>
                  <span className="value">{result.complexity.toLocaleString()}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">총 파라미터 수</span>
                  <span className="value">{result.params.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}