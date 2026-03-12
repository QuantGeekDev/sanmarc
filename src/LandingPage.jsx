import { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "34642822616";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Sancmart%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20sobre%20sus%20servicios.`;

const SERVICES = [
  {
    id: "reformas",
    title: "Reformas",
    icon: "🏠",
    description: "Cocinas, baños, suelos, techos — transformamos tu hogar con acabados de primera calidad.",
    features: ["Reformas de cocinas", "Reformas de baños", "Suelos y revestimientos", "Reformas integrales"],
    accent: "#D4652B",
  },
  {
    id: "fontaneria",
    title: "Fontanería",
    icon: "🔧",
    description: "Fugas, atascos, instalaciones — respuesta rápida y soluciones duraderas para tu hogar.",
    features: ["Detección de fugas", "Instalación de tuberías", "Desatascos", "Mantenimiento de calderas"],
    accent: "#2B7DD4",
  },
  {
    id: "electricidad",
    title: "Electricidad",
    icon: "⚡",
    description: "Averías, instalaciones, cuadros eléctricos — electricistas autorizados a tu servicio.",
    features: ["Averías eléctricas", "Instalaciones nuevas", "Cuadros y boletines", "Iluminación LED"],
    accent: "#D4A22B",
  },
  {
    id: "mantenimiento",
    title: "Mantenimiento del Hogar",
    icon: "🛠️",
    description: "Pintura, carpintería, montajes y pequeñas reparaciones — tu hogar siempre a punto.",
    features: ["Pintura interior y exterior", "Carpintería y puertas", "Montaje de muebles", "Reparaciones generales"],
    accent: "#2BD49A",
  },
];

const TESTIMONIALS = [
  { name: "María G.", text: "Nos reformaron toda la cocina en tiempo récord. Un equipo increíble y muy profesional.", rating: 5 },
  { name: "Tomás R.", text: "Tuvimos un problema eléctrico urgente y vinieron en menos de una hora. Servicio impecable.", rating: 5 },
  { name: "Elena P.", text: "Profesionales, puntuales y el precio fue exactamente el presupuestado. Sin sorpresas.", rating: 5 },
  { name: "Jordi M.", text: "Les encargamos el mantenimiento integral de nuestra comunidad. Siempre cumplen y a buen precio.", rating: 5 },
];

const DAYS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00", "19:00"];

function CalendarPicker({ selectedDate, onSelectDate, selectedTime, onSelectTime }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDay = new Date(viewYear, viewMonth, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const isSameDay = (d) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === d && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
  };

  const isPast = (d) => {
    const check = new Date(viewYear, viewMonth, d);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const isSunday = (d) => {
    return new Date(viewYear, viewMonth, d).getDay() === 0;
  };

  const isToday = (d) => {
    return d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
      }}>
        <button
          onClick={() => {
            if (canGoPrev) {
              if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
              else setViewMonth(viewMonth - 1);
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: canGoPrev ? "#888" : "#333",
            fontSize: "18px",
            cursor: canGoPrev ? "pointer" : "default",
            padding: "4px 8px",
          }}
        >←</button>
        <span style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#f0ece4",
        }}>{MONTHS_ES[viewMonth]} {viewYear}</span>
        <button
          onClick={() => {
            if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
            else setViewMonth(viewMonth + 1);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >→</button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        marginBottom: "8px",
      }}>
        {DAYS_ES.map(d => (
          <div key={d} style={{
            textAlign: "center",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: "#555",
            padding: "6px 0",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>{d}</div>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
      }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const past = isPast(d);
          const sunday = isSunday(d);
          const disabled = past || sunday;
          const selected = isSameDay(d);
          const todayMark = isToday(d);

          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => {
                if (!disabled) onSelectDate(new Date(viewYear, viewMonth, d));
              }}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "10px",
                border: selected ? "2px solid #D4652B" : todayMark ? "1px solid #333" : "1px solid transparent",
                background: selected ? "#D4652B22" : "transparent",
                color: disabled ? "#333" : selected ? "#D4652B" : todayMark ? "#f0ece4" : "#aaa",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "14px",
                fontWeight: selected || todayMark ? 700 : 400,
                cursor: disabled ? "default" : "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >{d}</button>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ marginTop: "20px" }}>
          <div style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "10px",
          }}>Elige hora</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}>
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                onClick={() => onSelectTime(t)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: selectedTime === t ? "2px solid #D4652B" : "1px solid #222",
                  background: selectedTime === t ? "#D4652B18" : "#111",
                  color: selectedTime === t ? "#D4652B" : "#aaa",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "14px",
                  fontWeight: selectedTime === t ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StarRating({ rating, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.floor(rating) ? "#FBBF24" : i < rating ? "url(#half)" : "#333"}>
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#333" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function WhatsAppButton({ variant = "primary", text = "Contactar por WhatsApp" }) {
  const [hovered, setHovered] = useState(false);

  const styles = {
    primary: {
      padding: "18px 36px",
      background: hovered ? "#1EBE5D" : "#25D366",
      borderRadius: "14px",
      fontSize: "16px",
      fontWeight: 700,
      boxShadow: hovered ? "0 12px 40px #25D36644" : "0 8px 32px #25D36633",
      transform: hovered ? "translateY(-2px)" : "translateY(0)",
    },
    floating: {
      position: "fixed",
      bottom: "28px",
      right: "28px",
      zIndex: 999,
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      padding: 0,
      background: hovered ? "#1EBE5D" : "#25D366",
      boxShadow: hovered ? "0 8px 30px #25D36666" : "0 6px 20px #25D36644",
      transform: hovered ? "scale(1.1)" : "scale(1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Clash Display', sans-serif",
        textDecoration: "none",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        ...styles[variant],
      }}
    >
      <svg width={variant === "floating" ? 32 : 22} height={variant === "floating" ? 32 : 22} viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {variant !== "floating" && text}
    </a>
  );
}

function ServiceCard({ service, index, onSelect, isSelected }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(service.id)}
      style={{
        background: isSelected ? `linear-gradient(145deg, ${service.accent}18, ${service.accent}08)` : hovered ? "#1a1a1a" : "#111",
        border: `2px solid ${isSelected ? service.accent : hovered ? "#333" : "#1a1a1a"}`,
        borderRadius: "16px",
        padding: "36px 28px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
        animationDelay: `${index * 120}ms`,
        animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards",
      }}
    >
      <div style={{
        position: "absolute",
        top: "-50px",
        right: "-30px",
        fontSize: "140px",
        opacity: hovered ? 0.06 : 0.03,
        transition: "opacity 0.4s ease",
        lineHeight: 1,
        pointerEvents: "none",
      }}>
        {service.icon}
      </div>

      <div style={{ fontSize: "44px", marginBottom: "16px" }}>{service.icon}</div>
      <h3 style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: "24px",
        fontWeight: 700,
        color: "#f0ece4",
        marginBottom: "10px",
      }}>{service.title}</h3>
      <p style={{
        fontFamily: "'Satoshi', sans-serif",
        fontSize: "14px",
        color: "#888",
        lineHeight: 1.7,
        marginBottom: "20px",
      }}>{service.description}</p>

      <div style={{ marginBottom: "24px" }}>
        {service.features.map((f, i) => (
          <div key={i} style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "13px",
            color: "#aaa",
            padding: "5px 0",
            borderBottom: i < service.features.length - 1 ? "1px solid #1f1f1f" : "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{ color: service.accent, fontSize: "10px" }}>●</span>
            {f}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: service.accent,
        }}>Presupuesto gratis</span>
        <span style={{
          fontFamily: "'Satoshi', sans-serif",
          fontSize: "13px",
          color: isSelected ? service.accent : "#555",
          fontWeight: 500,
          transition: "color 0.3s ease",
        }}>{isSelected ? "✓ Seleccionado" : "Seleccionar →"}</span>
      </div>
    </div>
  );
}

function BookingForm({ selectedServices, services }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const isStep1Valid = formData.name && formData.phone;
  const isStep2Valid = selectedDate && selectedTime;

  const handleSubmit = () => {
    if (isStep1Valid) setSubmitted(true);
  };

  const formatDate = (d) => {
    if (!d) return "";
    return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 40px",
        animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>✓</div>
        <h3 style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "#f0ece4",
          marginBottom: "12px",
        }}>Solicitud Recibida</h3>
        {selectedDate && selectedTime && (
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "16px",
            color: "#D4652B",
            fontWeight: 600,
            marginBottom: "8px",
          }}>Cita: {formatDate(selectedDate)} a las {selectedTime}h</p>
        )}
        <p style={{
          fontFamily: "'Satoshi', sans-serif",
          fontSize: "15px",
          color: "#888",
          marginBottom: "28px",
        }}>Te contactaremos en menos de 2 horas para confirmar.</p>
        <WhatsAppButton text="O escríbenos por WhatsApp" />
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    background: "#111",
    border: "1.5px solid #222",
    borderRadius: "10px",
    color: "#f0ece4",
    fontFamily: "'Satoshi', sans-serif",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "8px",
    display: "block",
  };

  const selectedNames = services.filter(s => selectedServices.includes(s.id)).map(s => s.title);

  return (
    <div style={{ animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      {selectedNames.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {selectedNames.map((name, i) => (
            <span key={i} style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#f0ece4",
              background: "#222",
              padding: "6px 14px",
              borderRadius: "100px",
              letterSpacing: "0.5px",
            }}>{name}</span>
          ))}
        </div>
      )}

      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "28px",
        background: "#111",
        borderRadius: "10px",
        padding: "4px",
        border: "1px solid #1a1a1a",
      }}>
        {[
          { n: 1, label: "Tus datos" },
          { n: 2, label: "Fecha y hora" },
        ].map(s => (
          <button key={s.n} onClick={() => setStep(s.n)} style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: step === s.n ? "#D4652B" : "transparent",
            color: step === s.n ? "#fff" : "#666",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}>{s.n}. {s.label}</button>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Nombre completo *</label>
              <input style={inputStyle} placeholder="Tu nombre" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#D4652B"}
                onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
            <div>
              <label style={labelStyle}>Teléfono *</label>
              <input style={inputStyle} placeholder="+34 600 000 000" value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#D4652B"}
                onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} placeholder="correo@ejemplo.com" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#D4652B"}
                onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
            <div>
              <label style={labelStyle}>Dirección</label>
              <input style={inputStyle} placeholder="Tu dirección" value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#D4652B"}
                onBlur={e => e.target.style.borderColor = "#222"} />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Describe el problema</label>
            <textarea style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              placeholder="Cuéntanos qué necesitas reparar o reformar..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              onFocus={e => e.target.style.borderColor = "#D4652B"}
              onBlur={e => e.target.style.borderColor = "#222"} />
          </div>

          <button
            onClick={() => { if (isStep1Valid) setStep(2); }}
            style={{
              width: "100%",
              padding: "16px",
              background: isStep1Valid ? "linear-gradient(135deg, #D4652B, #e07a40)" : "#222",
              color: isStep1Valid ? "#fff" : "#555",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: isStep1Valid ? "pointer" : "default",
              transition: "all 0.3s ease",
            }}
          >Siguiente: Elegir fecha →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{
            background: "#0c0c0c",
            border: "1px solid #1a1a1a",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "24px",
          }}>
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
          </div>

          {selectedDate && selectedTime && (
            <div style={{
              background: "#D4652B10",
              border: "1px solid #D4652B33",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <span style={{ fontSize: "20px" }}>📅</span>
              <div>
                <div style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#D4652B",
                }}>{formatDate(selectedDate)}</div>
                <div style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "13px",
                  color: "#888",
                }}>a las {selectedTime}h · {formData.name}</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: "16px 24px",
                background: "transparent",
                color: "#888",
                border: "1px solid #222",
                borderRadius: "12px",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >← Atrás</button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                padding: "16px",
                background: isStep1Valid ? "linear-gradient(135deg, #D4652B, #e07a40)" : "#222",
                color: isStep1Valid ? "#fff" : "#555",
                border: "none",
                borderRadius: "12px",
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                cursor: isStep1Valid ? "pointer" : "default",
                transition: "all 0.3s ease",
              }}
            >{selectedDate && selectedTime ? "Confirmar Cita" : "Solicitar sin cita"}</button>
          </div>
        </div>
      )}

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginTop: "20px",
      }}>
        <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
        <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: "2px" }}>o bien</span>
        <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <WhatsAppButton text="Escríbenos por WhatsApp" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const bookingRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      background: "#0a0a0a",
      color: "#f0ece4",
      minHeight: "100vh",
      fontFamily: "'Satoshi', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&f[]=satoshi@400,500,700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        ::selection { background: #D4652B; color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "20px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: scrollY > 50 ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        transition: "all 0.4s ease",
        borderBottom: scrollY > 50 ? "1px solid #1a1a1a" : "1px solid transparent",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            width: "38px",
            height: "38px",
            background: "linear-gradient(135deg, #D4652B, #e8924c)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}>⚡</span>
          <div>
            <div style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}>SANCMART</div>
            <div style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "10px",
              color: "#666",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}>Asistencia del Hogar y Reformas</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Servicios", "Proceso", "Opiniones"].map((item, i) => (
            <a key={i} href={`#${item.toLowerCase()}`} style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#888",
              textDecoration: "none",
              transition: "color 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => e.target.style.color = "#f0ece4"}
            onMouseLeave={e => e.target.style.color = "#888"}
            >{item}</a>
          ))}
          <a href="tel:+34642822616" style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#f0ece4",
            textDecoration: "none",
            padding: "10px 20px",
            border: "1px solid #333",
            borderRadius: "8px",
            transition: "border-color 0.3s",
          }}
          onMouseEnter={e => e.target.style.borderColor = "#666"}
          onMouseLeave={e => e.target.style.borderColor = "#333"}
          >642 82 26 16</a>
          <button onClick={scrollToBooking} style={{
            padding: "10px 24px",
            background: "#D4652B",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}>Pedir Cita</button>
        </div>
      </nav>

      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "120px 48px 80px",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #D4652B08, transparent 70%)",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, #2B7DD408, transparent 70%)",
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite 2s",
        }} />

        <div style={{ textAlign: "center", maxWidth: "900px", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#111",
            border: "1px solid #1f1f1f",
            borderRadius: "100px",
            padding: "8px 20px 8px 12px",
            marginBottom: "32px",
            animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <StarRating rating={4.2} size={14} />
            <span style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#ccc",
            }}>4,2 estrellas · 12 reseñas en Google</span>
          </div>

          <div style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#D4652B",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "28px",
            animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s backwards",
          }}>
            <span style={{ animation: "pulse 2s infinite" }}>●</span> L'Hospitalet de Llobregat · +3 años de experiencia
          </div>

          <h1 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: "28px",
            animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards",
          }}>
            Tu Hogar,{" "}
            <span style={{
              background: "linear-gradient(135deg, #D4652B, #e8924c, #D4A22B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              En Buenas Manos
            </span>
          </h1>

          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "18px",
            color: "#777",
            lineHeight: 1.8,
            maxWidth: "580px",
            margin: "0 auto 48px",
            animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards",
          }}>
            Reformas, fontanería, electricidad y mantenimiento del hogar en L'Hospitalet de Llobregat.
            Una llamada. Técnicos expertos. Satisfacción garantizada.
          </p>

          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards",
          }}>
            <button onClick={scrollToBooking} style={{
              padding: "18px 40px",
              background: "linear-gradient(135deg, #D4652B, #e07a40)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 8px 32px #D4652B33",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px #D4652B44"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px #D4652B33"; }}
            >Pedir Cita Gratis →</button>

            <WhatsAppButton />

            <a href="tel:+34642822616" style={{
              padding: "18px 40px",
              background: "transparent",
              color: "#f0ece4",
              border: "1.5px solid #333",
              borderRadius: "12px",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.3s ease",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#666"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
            >📞 642 82 26 16</a>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginTop: "72px",
            animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards",
          }}>
            {[
              { num: "2.400+", label: "Trabajos Realizados" },
              { num: "98%", label: "Satisfacción" },
              { num: "<2h", label: "Tiempo de Respuesta" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#f0ece4",
                }}>{stat.num}</div>
                <div style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "12px",
                  color: "#555",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: "60px 48px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div style={{
          background: "#111",
          border: "1px solid #1a1a1a",
          borderRadius: "20px",
          padding: "40px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          {[
            { icon: "📍", label: "Ubicación", value: "L'Hospitalet de Llobregat" },
            { icon: "📞", label: "Teléfono", value: "642 82 26 16" },
            { icon: "🕐", label: "Horario", value: "Lun–Sáb · Hasta las 20h" },
            { icon: "🚚", label: "Servicio", value: "A domicilio" },
            { icon: "⭐", label: "Google", value: "4,2 ★ (12 reseñas)" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", flex: "1 1 150px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
              <div style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "4px",
              }}>{item.label}</div>
              <div style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#f0ece4",
              }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="servicios" style={{
        padding: "100px 48px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "64px" }}>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: "#D4652B",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>Nuestros Servicios</span>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            color: "#f0ece4",
            marginTop: "16px",
          }}>¿Qué Necesitas?</h2>
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "15px",
            color: "#666",
            marginTop: "12px",
          }}>Selecciona los servicios que necesitas y te contactamos con un presupuesto sin compromiso.</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}>
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              onSelect={toggleService}
              isSelected={selectedServices.includes(service.id)}
            />
          ))}
        </div>
      </section>

      <section id="proceso" style={{
        padding: "100px 48px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "64px" }}>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: "#D4652B",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>Proceso</span>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            color: "#f0ece4",
            marginTop: "16px",
          }}>¿Cómo Funciona?</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "32px",
        }}>
          {[
            { step: "01", title: "Elige Servicios", desc: "Selecciona lo que necesitas de nuestras tarjetas de servicio.", icon: "☑️" },
            { step: "02", title: "Elige Fecha", desc: "Escoge el día y hora que mejor te venga en nuestro calendario.", icon: "📅" },
            { step: "03", title: "Confirmamos", desc: "Te llamamos en menos de 2 horas para confirmar tu cita.", icon: "📞" },
            { step: "04", title: "Problema Resuelto", desc: "Nuestros técnicos certificados lo solucionan — garantizado.", icon: "✅" },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "32px 24px",
              borderLeft: "2px solid #1a1a1a",
              transition: "border-color 0.3s ease",
              animation: `slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms backwards`,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#D4652B"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
            >
              <div style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#333",
                marginBottom: "16px",
              }}>{item.step}</div>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{item.icon}</div>
              <h3 style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#f0ece4",
                marginBottom: "8px",
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "14px",
                color: "#666",
                lineHeight: 1.7,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="opiniones" style={{
        padding: "100px 48px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "64px" }}>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: "#D4652B",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>Opiniones</span>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            color: "#f0ece4",
            marginTop: "16px",
          }}>Lo Que Dicen Nuestros Clientes</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "16px",
              padding: "32px 24px",
              animation: `fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms backwards`,
            }}>
              <div style={{ marginBottom: "14px" }}>
                <StarRating rating={t.rating} />
              </div>
              <p style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "14px",
                color: "#aaa",
                lineHeight: 1.8,
                marginBottom: "20px",
                fontStyle: "italic",
              }}>"{t.text}"</p>
              <div style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#f0ece4",
              }}>— {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={bookingRef} id="presupuesto" style={{
        padding: "100px 48px",
        maxWidth: "720px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: "#D4652B",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>Reservar Cita</span>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 700,
            color: "#f0ece4",
            marginTop: "16px",
            marginBottom: "12px",
          }}>Pide tu Cita</h2>
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "15px",
            color: "#666",
          }}>
            {selectedServices.length === 0
              ? "Selecciona servicios arriba, rellena tus datos y elige fecha y hora."
              : `${selectedServices.length} servicio${selectedServices.length > 1 ? "s" : ""} seleccionado${selectedServices.length > 1 ? "s" : ""}. Rellena tus datos y elige cuándo te viene bien.`
            }
          </p>
        </div>

        <div style={{
          background: "#0f0f0f",
          border: "1px solid #1a1a1a",
          borderRadius: "20px",
          padding: "36px",
        }}>
          <BookingForm selectedServices={selectedServices} services={SERVICES} />
        </div>
      </section>

      <footer style={{
        padding: "48px",
        borderTop: "1px solid #141414",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #D4652B, #e8924c)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}>⚡</span>
            <div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "16px", fontWeight: 700 }}>SANCMART</div>
              <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "10px", color: "#555" }}>Asistencia del Hogar y Reformas</div>
            </div>
          </div>
          <div style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "13px",
            color: "#444",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}>
            <span>📍 L'Hospitalet de Llobregat</span>
            <span>📞 642 82 26 16</span>
          </div>
          <div style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "13px",
            color: "#333",
          }}>© 2026 Sancmart. Todos los derechos reservados.</div>
        </div>
      </footer>

      <WhatsAppButton variant="floating" />
    </div>
  );
}
