"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Parse CSV function
const parseCsv = (csv: string) => {
  const lines = csv.trim().split("\n")
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return {
      Name: values[0],
      Input: values[1],
      Output: values[2]
    }
  })
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#1e1e1e', 
        border: '1px solid #333',
        borderRadius: '6px',
        color: 'white'
      }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ 
            color: entry.color,
            margin: '3px 0'
          }}>
            {entry.name}: ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [displayMode, setDisplayMode] = useState<string>("both")

  useEffect(() => {
    // Fetch the CSV data from the public file
    fetch('/data/model_prices.csv')
      .then(response => response.text())
      .then(csvData => {
        const parsedData = parseCsv(csvData)
        setData(parsedData)
        // Initially select all models
        setSelectedModels(parsedData.map((item) => item.Name))
      })
      .catch(error => {
        console.error("Error loading CSV data:", error)
      })
  }, [])

  useEffect(() => {
    // Filter data based on selected models
    const filtered = data.filter((item) => selectedModels.includes(item.Name))
    setFilteredData(filtered)
  }, [selectedModels, data])

  const handleModelToggle = (modelName: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelName)) {
        return prev.filter((name) => name !== modelName)
      } else {
        return [...prev, modelName]
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedModels(data.map((item) => item.Name))
  }

  const handleDeselectAll = () => {
    setSelectedModels([])
  }

  const formatDollar = (value: string) => {
    // Remove $ and convert to number
    return Number.parseFloat(value.replace("$", ""))
  }

  // Group models by price range for filtering
  const lowPriceModels = data.filter((item) => formatDollar(item.Input) < 1).map((item) => item.Name)
  const midPriceModels = data
    .filter((item) => formatDollar(item.Input) >= 1 && formatDollar(item.Input) < 10)
    .map((item) => item.Name)
  const highPriceModels = data.filter((item) => formatDollar(item.Input) >= 10).map((item) => item.Name)

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    switch (value) {
      case "low":
        setSelectedModels(lowPriceModels)
        break
      case "mid":
        setSelectedModels(midPriceModels)
        break
      case "high":
        setSelectedModels(highPriceModels)
        break
      case "all":
      default:
        setSelectedModels(data.map((item) => item.Name))
        break
    }
  }

  const handleDisplayModeChange = (value: string) => {
    setDisplayMode(value)
  }

  // Prepare chart data
  const chartData = filteredData.map((item) => ({
    name: item.Name,
    Input: formatDollar(item.Input),
    Output: formatDollar(item.Output),
  }))

  // Define colors for dark mode
  const inputColor = "#818cf8" // lighter indigo for dark mode
  const outputColor = "#22d3ee" // lighter cyan for dark mode

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #333'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* Chart Section */}
            <div style={{ flex: '1' }}>
              <div style={{ height: '600px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      tick={{ fill: "#ffffff" }}
                    />
                    <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} tick={{ fill: "#ffffff" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        color: "#ffffff",
                      }}
                    />
                    {(displayMode === "both" || displayMode === "input") && (
                      <Bar dataKey="Input" fill={inputColor} name="Input Cost" />
                    )}
                    {(displayMode === "both" || displayMode === "output") && (
                      <Bar dataKey="Output" fill={outputColor} name="Output Cost" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Settings Panel */}
            <div style={{ width: '280px', flexShrink: 0 }}>
              <div style={{ 
                backgroundColor: '#1e1e1e', 
                border: '1px solid #333',
                borderRadius: '8px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Settings</h2>
                  <p style={{ margin: '0', fontSize: '14px', color: '#9ca3af' }}>Toggle models to display</p>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Price Range</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {['all', 'low', 'mid', 'high'].map((tab) => (
                        <button 
                          key={tab}
                          onClick={() => handleTabChange(tab)}
                          style={{
                            backgroundColor: activeTab === tab ? '#2563eb' : '#1f2937',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Display</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {['both', 'input', 'output'].map((mode) => (
                        <button 
                          key={mode}
                          onClick={() => handleDisplayModeChange(mode)}
                          style={{
                            backgroundColor: displayMode === mode ? '#2563eb' : '#1f2937',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <button 
                        onClick={handleSelectAll}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: '1px solid #4b5563',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Select All
                      </button>
                      <button 
                        onClick={handleDeselectAll}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: '1px solid #4b5563',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Deselect All
                      </button>
                    </div>

                    <div style={{ height: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                      {data.map((model) => (
                        <div key={model.Name} style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          margin: '8px 0'
                        }}>
                          <input
                            type="checkbox"
                            id={model.Name}
                            checked={selectedModels.includes(model.Name)}
                            onChange={() => handleModelToggle(model.Name)}
                            style={{ marginRight: '8px' }}
                          />
                          <label
                            htmlFor={model.Name}
                            style={{ 
                              fontSize: '14px', 
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {model.Name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
