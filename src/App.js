import React, { useState } from 'react';
import { CNNModel } from './models/CNNModel';
import { RNNModel } from './models/RNNModel';
import { TransformerModel } from './models/TransformerModel';
import { GANModel } from './models/GANModel';
import './App.css';

const MODEL_GROUPS = [
  {
    type: 'CNN',
    color: '#3b82f6',
    complexity: 'O(H·W·C·K²)',
    instances: [
      new CNNModel("CNN_Edge_Detector", 16, 3),
      new CNNModel("CNN_Vision_Pro", 64, 3),
      new CNNModel("CNN_Medical_Scans", 128, 5),
    ],
    inputFields: [
      { key: 'width', label: '가로 (px)', defaultValue: 224 },
      { key: 'height', label: '세로 (px)', defaultValue: 224 },
      { key: 'channels', label: '채널 수', defaultValue: 3 },
    ],
    getInput: (vals) => [Number(vals.width), Number(vals.height), Number(vals.channels)],
  },
  {
    type: 'RNN',
    color: '#22c55e',
    complexity: 'O(T·H²)',
    instances: [
      new RNNModel("RNN_Small_Bot", 64),
      new RNNModel("RNN_Standard_Chat", 256),
      new RNNModel("RNN_Heavy_Translator", 1024),
    ],
    inputFields: [
      { key: 'sentence', label: '문장 입력', defaultValue: 'I love deep learning' },
    ],
    getInput: (vals) => vals.sentence.trim().split(' '),
  },
  {
    type: 'Transformer',
    color: '#f59e0b',
    complexity: 'O(T²·H)',
    instances: [
      new TransformerModel("Transformer_Nano", 4, 2, 128),
      new TransformerModel("Transformer_Base", 8, 6, 512),
      new TransformerModel("Transformer_LLM", 16, 12, 1024),
    ],
    inputFields: [
      { key: 'sentence', label: '문장 입력', defaultValue: 'The quick brown fox jumps' },
    ],
    getInput: (vals) => vals.sentence.trim().split(' '),
  },
  {
    type: 'GAN',
    color: '#ef4444',
    complexity: 'O(P·B)',
    instances: [
      new GANModel("GAN_Pixel_Art", 50, 128, 784),
      new GANModel("GAN_DeepFake_Base", 100, 256, 1024),
      new GANModel("GAN_HighRes_Gen", 256, 1024, 4096),
    ],
    inputFields: [
      { key: 'count', label: '생성할 이미지 수', defaultValue: 5 },
    ],
    getInput: (vals) => Array(Number(vals.count)).fill('img'),
  },
];

const MAX_CONSOLE_LINES = 20;

export default function App() {
  const [selected, setSelected] = useState(null);
  const [inputVals, setInputVals] = useState({});
  const [result, setResult] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([
    { text: '> AI Model OOP Visualizer v1.0.0', color: '#22c55e' },
    { text: '> 12 instances loaded successfully.', color: '#94a3b8' },
    { text: '> Click an instance card to begin.', color: '#94a3b8' },
  ]);
  const [animatedBars, setAnimatedBars] = useState(false);

  const addLogs = (newLogs) => {
    setConsoleLogs(prev => [...prev, ...newLogs].slice(-MAX_CONSOLE_LINES));
  };

  const handleCardClick = (group, instance) => {
    const defaults = {};
    group.inputFields.forEach(f => { defaults[f.key] = f.defaultValue; });
    setSelected({ group, instance });
    setInputVals(defaults);
    setResult(null);
    setAnimatedBars(false);
    addLogs([
      { text: `> Selected: ${instance.name}`, color: '#f59e0b' },
      { text: `> Type: ${group.type}Model | Complexity: ${group.complexity}`, color: '#94a3b8' },
    ]);
  };

  const handleCalculate = () => {
    const { group, instance } = selected;
    const input = group.getInput(inputVals);

    const complexity = instance.calculateComplexity(input);
    const params = instance.calculateTotalParameters(input);
    const info = instance.introduce();

    const comparisons = group.instances.map(inst => ({
      name: inst.name,
      complexity: inst.calculateComplexity(input),
      params: inst.calculateTotalParameters(input),
    }));

    const maxComplexity = Math.max(...comparisons.map(c => Math.log10(c.complexity + 1)));
    const maxParams = Math.max(...comparisons.map(c => Math.log10(c.params + 1)));

    setResult({ info, complexity, params, input, group, comparisons, maxComplexity, maxParams });
    setAnimatedBars(false);
    setTimeout(() => setAnimatedBars(true), 50);

    addLogs([
      { text: `> Calling calculateComplexity(${JSON.stringify(input)})`, color: '#60a5fa' },
      { text: `> Result: complexity = ${complexity.toLocaleString()}`, color: '#22c55e' },
      { text: `> Calling calculateTotalParameters()`, color: '#60a5fa' },
      { text: `> Result: params = ${params.toLocaleString()}`, color: '#22c55e' },
      { text: `> Comparing all ${group.type} instances...`, color: '#f59e0b' },
    ]);
  };

  return (
    <div className="dashboard">
      <div className="grid-bg" />

      {/* 좌측 패널 */}
      <div className="left-panel">
        <div className="panel-header">
          <div className="header-dot" />
          <h1>AI Model OOP <span className="gradient-text">Visualizer</span></h1>
          <p className="header-sub">Polymorphism & Inheritance Architecture</p>
        </div>

        <div className="hierarchy">
          <div className="node adt">
            <span className="node-badge">Abstract</span>
            AIModelADT
          </div>
          <div className="conn-line" />
          <div className="node base">
            <span className="node-badge">Base</span>
            BaseModel
          </div>
          <div className="conn-line" />

          <div className="model-groups">
            {MODEL_GROUPS.map((group) => (
              <div key={group.type} className="group-col">
                <div className="group-label" style={{ borderColor: group.color, color: group.color }}>
                  <span className="status-dot" style={{ background: group.color }} />
                  {group.type}
                </div>
                <div className="complexity-badge">{group.complexity}</div>
                {group.instances.map((instance) => {
                  const isSelected = selected?.instance?.name === instance.name;
                  return (
                    <div
                      key={instance.name}
                      className={`instance-card ${isSelected ? 'active' : ''}`}
                      style={{
                        borderColor: isSelected ? group.color : 'rgba(255,255,255,0.08)',
                        boxShadow: isSelected ? `0 0 16px ${group.color}55` : 'none',
                      }}
                      onClick={() => handleCardClick(group, instance)}
                    >
                      <span className="card-dot" style={{ background: group.color }} />
                      <span className="card-name">{instance.name}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 우측 패널 */}
      <div className="right-panel">

        {/* 컨트롤 패널 */}
        <div className="control-panel">
          <div className="panel-title">
            <span className="panel-icon">⚙️</span> Control Panel
          </div>

          {selected ? (() => {
            // introduce() 한 번만 호출
            const info = selected.instance.introduce();
            const modelSpecificKeys = Object.keys(info).filter(
              k => !['name', 'proposedBy', 'year', 'coreMechanism'].includes(k)
            );
            return (
              <>
                <div className="selected-info" style={{ borderColor: selected.group.color }}>
                  <div className="selected-type" style={{ color: selected.group.color }}>
                    {selected.group.type}Model
                  </div>
                  <div className="selected-name">{info.name}</div>
                  <div className="selected-meta">
                    {modelSpecificKeys.map(k => (
                      <div key={k} className="meta-row">
                        <span className="meta-key">{k}</span>
                        <span className="meta-val">{String(info[k])}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-rows">
                  <div className="info-row"><span className="lbl">고안자</span><span className="val">{info.proposedBy}</span></div>
                  <div className="info-row"><span className="lbl">연도</span><span className="val">{info.year}</span></div>
                  <div className="info-row"><span className="lbl">메커니즘</span><span className="val">{info.coreMechanism}</span></div>
                </div>

                <div className="inputs">
                  {selected.group.inputFields.map(f => (
                    <div key={f.key} className="input-row">
                      <label>{f.label}</label>
                      <input
                        type="text"
                        value={inputVals[f.key] ?? f.defaultValue}
                        onChange={e => setInputVals({ ...inputVals, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <button
                    className="calc-btn"
                    style={{ background: selected.group.color }}
                    onClick={handleCalculate}
                  >
                    ▶ Run Polymorphic Call
                  </button>
                </div>
              </>
            );
          })() : (
            <div className="empty-state">← 왼쪽에서 인스턴스 카드를 클릭하세요</div>
          )}
        </div>

        {/* 결과 & 차트 */}
        {result && (
          <div className="result-panel">
            <div className="panel-title">
              <span className="panel-icon">📊</span> Benchmark Results
            </div>
            <div className="result-rows">
              <div className="result-row">
                <span className="lbl">계산 복잡도</span>
                <span className="val highlight">{result.complexity.toLocaleString()}</span>
              </div>
              <div className="result-row">
                <span className="lbl">총 파라미터 수</span>
                <span className="val highlight">{result.params.toLocaleString()}</span>
              </div>
              <div className="result-row">
                <span className="lbl">입력 데이터</span>
                <span className="val">{JSON.stringify(result.input)}</span>
              </div>
            </div>

            <div className="chart">
              <div className="chart-title">Instance Comparison — {result.group.type}Model</div>

              <div className="chart-section-label">Complexity</div>
              {result.comparisons.map(c => {
                const isSelected = c.name === result.info.name;
                return (
                  <div className="bar-item" key={c.name + '_complexity'}>
                    <div className="bar-label">
                      <span style={{ color: isSelected ? result.group.color : '#64748b' }}>
                        {isSelected ? '▶ ' : ''}{c.name}
                      </span>
                      <span>{c.complexity.toLocaleString()}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: animatedBars ? `${(Math.log10(c.complexity + 1) / result.maxComplexity) * 100}%` : '0%',
                          background: isSelected ? result.group.color : 'rgba(255,255,255,0.15)',
                          boxShadow: isSelected ? `0 0 10px ${result.group.color}88` : 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="chart-section-label" style={{ marginTop: '12px' }}>Parameters</div>
              {result.comparisons.map(c => {
                const isSelected = c.name === result.info.name;
                return (
                  <div className="bar-item" key={c.name + '_params'}>
                    <div className="bar-label">
                      <span style={{ color: isSelected ? result.group.color : '#64748b' }}>
                        {isSelected ? '▶ ' : ''}{c.name}
                      </span>
                      <span>{c.params.toLocaleString()}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: animatedBars ? `${(Math.log10(c.params + 1) / result.maxParams) * 100}%` : '0%',
                          background: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.15)',
                          boxShadow: isSelected ? '0 0 10px #a78bfa88' : 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 콘솔 */}
        <div className="console-panel">
          <div className="console-header">
            <span className="console-dot red" />
            <span className="console-dot yellow" />
            <span className="console-dot green" />
            <span className="console-title">Dynamic Binding Console</span>
          </div>
          <div className="console-body">
            {consoleLogs.map((log, i) => (
              <div key={i} className="console-line" style={{ color: log.color }}>{log.text}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}