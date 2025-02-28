import React, { useState } from 'react';
import { X, Globe, Bell, Shield, Moon, Sun, Volume2, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useLanguage } from '../hooks/useLanguage';

interface SettingsPanelProps {
  onClose: () => void;
  theme: string;
  onThemeChange: () => void;
  language?: string;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: 'toggle' | 'select';
  options?: string[];
}

export function SettingsPanel({ onClose, theme, onThemeChange, language = 'en' }: SettingsPanelProps) {
  const { language: currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [settingValues, setSettingValues] = useState({
    notifications: true,
    units: 'Metric',
    privacy: false,
    sound: true,
  });

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };

  // Translations based on current language
  const translations = {
    en: {
      settings: 'Settings',
      theme: {
        label: 'Theme',
        description: 'Switch between light and dark mode'
      },
      language: {
        label: 'Language',
        description: 'Choose your preferred language'
      },
      notifications: {
        label: 'Push Notifications',
        description: 'Get real-time updates about your journey'
      },
      units: {
        label: 'Distance Units',
        description: 'Choose your preferred measurement system',
        metric: 'Metric',
        imperial: 'Imperial'
      },
      privacy: {
        label: 'Privacy Mode',
        description: 'Control your location sharing settings'
      },
      sound: {
        label: 'Sound Effects',
        description: 'Enable or disable app sounds'
      }
    },
    es: {
      settings: 'Configuración',
      theme: {
        label: 'Tema',
        description: 'Cambiar entre modo claro y oscuro'
      },
      language: {
        label: 'Idioma',
        description: 'Elige tu idioma preferido'
      },
      notifications: {
        label: 'Notificaciones Push',
        description: 'Recibe actualizaciones en tiempo real sobre tu viaje'
      },
      units: {
        label: 'Unidades de Distancia',
        description: 'Elige tu sistema de medición preferido',
        metric: 'Métrico',
        imperial: 'Imperial'
      },
      privacy: {
        label: 'Modo Privacidad',
        description: 'Controla la compartición de tu ubicación'
      },
      sound: {
        label: 'Efectos de Sonido',
        description: 'Activar o desactivar sonidos de la aplicación'
      }
    },
    fr: {
      settings: 'Paramètres',
      theme: {
        label: 'Thème',
        description: 'Basculer entre mode clair et sombre'
      },
      language: {
        label: 'Langue',
        description: 'Choisissez votre langue préférée'
      },
      notifications: {
        label: 'Notifications Push',
        description: 'Recevez des mises à jour en temps réel sur votre voyage'
      },
      units: {
        label: 'Unités de Distance',
        description: 'Choisissez votre système de mesure préféré',
        metric: 'Métrique',
        imperial: 'Impérial'
      },
      privacy: {
        label: 'Mode Confidentialité',
        description: 'Contrôlez le partage de votre localisation'
      },
      sound: {
        label: 'Effets Sonores',
        description: 'Activer ou désactiver les sons de l\'application'
      }
    },
    de: {
      settings: 'Einstellungen',
      theme: {
        label: 'Design',
        description: 'Zwischen Hell- und Dunkelmodus wechseln'
      },
      language: {
        label: 'Sprache',
        description: 'Wählen Sie Ihre bevorzugte Sprache'
      },
      notifications: {
        label: 'Push-Benachrichtigungen',
        description: 'Erhalten Sie Echtzeit-Updates zu Ihrer Reise'
      },
      units: {
        label: 'Entfernungseinheiten',
        description: 'Wählen Sie Ihr bevorzugtes Maßsystem',
        metric: 'Metrisch',
        imperial: 'Imperial'
      },
      privacy: {
        label: 'Privatsphäre-Modus',
        description: 'Steuern Sie Ihre Standortfreigabe'
      },
      sound: {
        label: 'Soundeffekte',
        description: 'App-Sounds aktivieren oder deaktivieren'
      }
    }
  };

  // Use the current language or fallback to English
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const settings: Setting[] = [
    {
      id: 'notifications',
      title: t.notifications.label,
      description: t.notifications.description,
      icon: Bell,
      type: 'toggle',
    },
    {
      id: 'language',
      title: t.language.label,
      description: t.language.description,
      icon: Languages,
      type: 'select',
      options: supportedLanguages,
    },
    {
      id: 'units',
      title: t.units.label,
      description: t.units.description,
      icon: Globe,
      type: 'select',
      options: [t.units.metric, t.units.imperial],
    },
    {
      id: 'privacy',
      title: t.privacy.label,
      description: t.privacy.description,
      icon: Shield,
      type: 'toggle',
    },
    {
      id: 'sound',
      title: t.sound.label,
      description: t.sound.description,
      icon: Volume2,
      type: 'toggle',
    },
  ];

  const handleToggle = (settingId: string) => {
    setSettingValues(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof settingValues]
    }));
  };

  const handleSelect = async (settingId: string, value: string) => {
    if (settingId === 'language') {
      await changeLanguage(value);
    } else {
      setSettingValues(prev => ({
        ...prev,
        [settingId]: value
      }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-[1000] top-20 right-8 w-[calc(100vw-2rem)] md:w-96 max-h-[calc(100vh-160px)] bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{t.settings}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                  <div>
                    <h3 className="text-white font-medium">{t.theme.label}</h3>
                    <p className="text-white/60 text-sm">{t.theme.description}</p>
                  </div>
                </div>
                <button
                  onClick={onThemeChange}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors duration-300",
                    theme === 'dark' ? 'bg-purple-500/50' : 'bg-white/20'
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300",
                      theme === 'dark'
                        ? 'translate-x-6 bg-purple-400'
                        : 'bg-yellow-400'
                    )}
                  />
                </button>
              </div>
            </motion.div>

            {settings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <setting.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h3 className="text-white font-medium truncate">{setting.title}</h3>
                      <p className="text-white/60 text-sm truncate">{setting.description}</p>
                    </div>
                  </div>
                  {setting.type === 'toggle' ? (
                    <button
                      onClick={() => handleToggle(setting.id)}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
                        settingValues[setting.id as keyof typeof settingValues]
                          ? 'bg-blue-500/50'
                          : 'bg-white/20'
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                          settingValues[setting.id as keyof typeof settingValues] && 'translate-x-6'
                        )}
                      />
                    </button>
                  ) : (
                    <select
                      value={setting.id === 'language' ? currentLanguage : settingValues[setting.id as keyof typeof settingValues]}
                      onChange={(e) => handleSelect(setting.id, e.target.value)}
                      className="bg-white/10 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                    >
                      {setting.id === 'language' ? (
                        supportedLanguages.map((lang) => (
                          <option key={lang} value={lang} className="bg-gray-900">
                            {languageNames[lang as keyof typeof languageNames]}
                          </option>
                        ))
                      ) : (
                        setting.options?.map((option) => (
                          <option key={option} value={option} className="bg-gray-900">
                            {option}
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}