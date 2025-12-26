interface ControlPanelProps {
  learningRate: number;
  epoch: number;
  accuracy: number;
  loss: number;
  isTraining: boolean;
  onToggleTraining: () => void;
}

export function ControlPanel({
  learningRate,
  epoch,
  accuracy,
  loss,
  isTraining,
  onToggleTraining,
}: ControlPanelProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white pointer-events-auto shadow-2xl shadow-blue-900/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isTraining ? "bg-green-400 animate-pulse" : "bg-yellow-400"
              }`}
            ></div>
            <h2 className="text-lg font-semibold tracking-wide text-white/90">
              {isTraining ? "Training Active" : "System Standby"}
            </h2>
          </div>

          <button
            onClick={onToggleTraining}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isTraining
                ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
            }`}
          >
            {isTraining ? "Pause Simulation" : "Resume Training"}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatBox
            label="Epoch"
            value={epoch.toString()}
            color="text-blue-400"
          />
          <StatBox
            label="Learning Rate"
            value={learningRate.toFixed(4)}
            color="text-purple-400"
          />
          <StatBox
            label="Accuracy"
            value={`${(accuracy * 100).toFixed(1)}%`}
            color="text-emerald-400"
          />
          <StatBox label="Loss" value={loss.toFixed(4)} color="text-rose-400" />
        </div>

        {/* Learning Rate Slider (Visual Only for now) */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between text-xs text-white/50 mb-2 font-mono">
            <span>LEARNING RATE MODULATION</span>
            <span>{(learningRate * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${learningRate * 1000}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
      <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">
        {label}
      </div>
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
