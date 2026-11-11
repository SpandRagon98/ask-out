import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { DateInvitation } from './components/DateInvitation';
import { Declined } from './components/Declined';
import { FinalConfirmation } from './components/FinalConfirmation';
import { Introduction } from './components/Introduction';
import { MorningGreeting } from './components/MorningGreeting';
import { PanicCheck } from './components/PanicCheck';
import { ProgressIndicator } from './components/ProgressIndicator';
import { RestaurantSelection } from './components/RestaurantSelection';
import { RevealTempo } from './components/Reveal';
import { TimeSelection } from './components/TimeSelection';
import { ToastProvider } from './components/Toast';
import { INITIAL_PLAN, STEPS, type PlanState, type ScreenId } from './lib/plan';

export default function App() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenId>(() => {
    // Dev-only shortcut for testing: http://localhost:5173/?screen=food
    if (import.meta.env.DEV) {
      const s = new URLSearchParams(window.location.search).get('screen') as ScreenId | null;
      if (s && (STEPS.includes(s) || s === 'declined')) return s;
    }
    return 'morning';
  });
  const [plan, setPlan] = useState<PlanState>(INITIAL_PLAN);
  const [navigated, setNavigated] = useState(false);
  const seen = useRef(new Set<ScreenId>());
  const [tempo, setTempo] = useState(1);

  const update = useCallback((patch: Partial<PlanState>) => setPlan((p) => ({ ...p, ...patch })), []);

  const go = useCallback(
    (next: ScreenId) => {
      seen.current.add(screen);
      // Second time on a screen? Don't make her sit through the slow reveal again.
      setTempo(seen.current.has(next) ? 0.12 : 1);
      setNavigated(true);
      setScreen(next);
    },
    [screen],
  );

  const restart = () => {
    seen.current.clear();
    setPlan(INITIAL_PLAN);
    setTempo(1);
    setScreen('morning');
  };

  const stepIndex = STEPS.indexOf(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'morning':
        return <MorningGreeting onNext={() => go('panic')} focusOnMount={navigated} />;
      case 'panic':
        return <PanicCheck onNext={() => go('intro')} />;
      case 'intro':
        return <Introduction onNext={() => go('question')} />;
      case 'question':
        return (
          <DateInvitation
            saidYes={plan.response === 'yes'}
            onYes={() => update({ response: 'yes' })}
            onDecline={() => {
              update({ response: 'no' });
              go('declined');
            }}
            onNext={() => go('food')}
          />
        );
      case 'food':
        return (
          <RestaurantSelection
            value={plan.restaurant}
            customName={plan.customRestaurant}
            onSelect={(restaurant) => update({ restaurant })}
            onCustomName={(customRestaurant) => update({ customRestaurant })}
            onNext={() => go('time')}
          />
        );
      case 'time':
        return (
          <TimeSelection
            value={plan.time}
            customTime={plan.customTime}
            onSelect={(time) => update({ time })}
            onCustomTime={(customTime) => update({ customTime })}
            onNext={() => go('plan')}
          />
        );
      case 'plan':
        return <FinalConfirmation plan={plan} onEdit={go} />;
      case 'declined':
        return <Declined onRestart={restart} />;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AnimatedBackground screen={screen} />
        <div className="app-shell relative flex flex-col overflow-hidden">
          {stepIndex >= 0 && (
            <ProgressIndicator
              current={stepIndex}
              total={STEPS.length}
              onBack={stepIndex > 0 ? () => go(STEPS[stepIndex - 1]) : undefined}
            />
          )}
          <main className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen}
                // Everything is designed to fit; the scroll here is only a
                // safety net for things like landscape phones.
                className="no-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.99 }}
                transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-full min-h-[30rem] landscape:max-md:min-h-[32rem]">
                  <RevealTempo.Provider value={tempo}>{renderScreen()}</RevealTempo.Provider>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </ToastProvider>
    </MotionConfig>
  );
}
