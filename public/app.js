const { useState, useEffect } = React;

// Funciones utilitarias
const generarRadicado = (fase) => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const contador = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `USCTg-${fase}-${año}-${mes}-${contador}`;
};

const esFase1Abierta = () => {
    const ahora = new Date();
    const día = ahora.getDate();
    return día >= 1 && día <= 5;
};

const descargarExcel = (datos, nombre = 'radicaciones') => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Radicaciones');
    XLSX.writeFile(wb, `${nombre}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Componente principal
const USCRadicacionApp = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [radicaciones, setRadicaciones] = useState(() => {
        try {
            const saved = localStorage.getItem('usc_radicaciones');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [currentStudent, setCurrentStudent] = useState(null);
    const [currentForm, setCurrentForm] = useState('login');
    const [filtros, setFiltros] = useState({
        fase: 'todas',
        busqueda: ''
    });

    useEffect(() => {
        localStorage.setItem('usc_radicaciones', JSON.stringify(radicaciones));
    }, [radicaciones]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (email === 'investigacionmedicina@usc.edu.co' && password === 'Investigacion2026$') {
            setUserType('admin');
            setLoggedIn(true);
            setCurrentForm('admin-dashboard');
        } else if (email.endsWith('@usc.edu.co')) {
            setUserType('student');
            setLoggedIn(true);
            setCurrentStudent({ email_inst: email });
            setCurrentForm('student-dashboard');
        } else {
            alert('Email debe ser institucional (@usc.edu.co)');
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUserType(null);
        setEmail('');
        setPassword('');
        setCurrentStudent(null);
        setCurrentForm('login');
    };

    // LOGIN VIEW
    if (!loggedIn) {
        return (
            <div style={{ background: 'linear-gradient(135deg, #003d82 0%, #1a5f9b 100%)' }} className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">USC</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Radicación TG</h1>
                        <p className="text-gray-600 text-sm">Sistema 2026 - Medicina</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correo institucional</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@usc.edu.co"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Acceder
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                        <p className="font-semibold text-blue-900">ℹ️ Información:</p>
                        <p className="text-blue-800">Coordinadora: Contacta al administrador</p>
                        <p className="text-blue-800">Estudiante: Usa tu correo @usc.edu.co</p>
                    </div>
                </div>
            </div>
        );
    }

    // STUDENT DASHBOARD
    if (userType === 'student' && currentForm === 'student-dashboard') {
        const estudianteRads = radicaciones.filter(r => 
            r.integrante1?.email_inst === email
        );
        const ultimaRad = estudianteRads[estudianteRads.length - 1];
        const fase1Abierta = esFase1Abierta();

        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Mi Trabajo de Grado</h1>
                            <p className="text-blue-100 text-sm">{email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                            🚪 Salir
                        </button>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 py-8">
                    {!fase1Abierta && !ultimaRad && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
                            <p className="font-semibold">⚠️ Fase 1 cerrada</p>
                            <p className="text-sm">Fase 1 abre del 1 al 5 de cada mes. Próxima apertura: próximo mes</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* FASE 1 */}
                        <div className={`p-5 rounded-xl border-2 transition ${
                            ultimaRad?.fase1?.estado === 'aprobado' ? 'bg-green-100 border-green-300' :
                            fase1Abierta && !ultimaRad ? 'bg-blue-100 border-blue-300' :
                            'bg-gray-100 border-gray-300'
                        }`}>
                            <h3 className="font-semibold text-lg mb-2">📄 FASE 1</h3>
                            <p className="text-xs opacity-90 mb-3">Solicitud Tutor</p>
                            
                            <div className="text-sm space-y-2">
                                {ultimaRad?.fase1?.estado === 'aprobado' ? (
                                    <>
                                        <p className="font-medium">✓ APROBADA</p>
                                        <p className="text-xs opacity-90">Tutores asignados</p>
                                    </>
                                ) : fase1Abierta && !ultimaRad ? (
                                    <>
                                        <p className="font-medium">⏳ ABIERTA (1-5)</p>
                                        <p className="text-xs opacity-90">Radica ahora</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium">⏳ Pendiente</p>
                                        <p className="text-xs opacity-90">Coordinadora revisa</p>
                                    </>
                                )}
                            </div>

                            {fase1Abierta && !ultimaRad && (
                                <button
                                    onClick={() => setCurrentForm('student-fase1')}
                                    className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    RADICAR FASE 1 →
                                </button>
                            )}
                        </div>

                        {/* FASE 2 */}
                        <div className={`p-5 rounded-xl border-2 transition ${
                            ultimaRad?.fase2?.estado === 'aprobado' ? 'bg-green-100 border-green-300' :
                            ultimaRad?.fase1?.estado === 'aprobado' ? 'bg-blue-100 border-blue-300' :
                            'bg-gray-100 border-gray-300'
                        }`}>
                            <h3 className="font-semibold text-lg mb-2">📋 FASE 2</h3>
                            <p className="text-xs opacity-90 mb-3">Aval Protocolo</p>
                            
                            <div className="text-sm space-y-2">
                                {ultimaRad?.fase1?.estado !== 'aprobado' ? (
                                    <p className="opacity-90">Completa Fase 1</p>
                                ) : ultimaRad?.fase2?.estado === 'aprobado' ? (
                                    <>
                                        <p className="font-medium">✓ APROBADA</p>
                                        <p className="text-xs opacity-90">Comité revisó</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium">⏳ Abierta</p>
                                        <p className="text-xs opacity-90">Máx 1 año</p>
                                    </>
                                )}
                            </div>

                            {ultimaRad?.fase1?.estado === 'aprobado' && ultimaRad?.fase2?.estado !== 'aprobado' && (
                                <button
                                    onClick={() => setCurrentForm('student-fase2')}
                                    className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    RADICAR FASE 2 →
                                </button>
                            )}
                        </div>

                        {/* FASE 3 */}
                        <div className={`p-5 rounded-xl border-2 transition ${
                            ultimaRad?.fase3?.estado === 'programada' ? 'bg-green-100 border-green-300' :
                            ultimaRad?.fase2?.estado === 'aprobado' ? 'bg-blue-100 border-blue-300' :
                            'bg-gray-100 border-gray-300'
                        }`}>
                            <h3 className="font-semibold text-lg mb-2">🎤 FASE 3</h3>
                            <p className="text-xs opacity-90 mb-3">Sustentación</p>
                            
                            <div className="text-sm space-y-2">
                                {ultimaRad?.fase2?.estado !== 'aprobado' ? (
                                    <p className="opacity-90">Completa Fase 2</p>
                                ) : (
                                    <>
                                        <p className="font-medium">⏳ Abierta</p>
                                        <p className="text-xs opacity-90">Máx 1 año</p>
                                    </>
                                )}
                            </div>

                            {ultimaRad?.fase2?.estado === 'aprobado' && (
                                <button
                                    onClick={() => setCurrentForm('student-fase3')}
                                    className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    RADICAR FASE 3 →
                                </button>
                            )}
                        </div>
                    </div>

                    {ultimaRad && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Radicados</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {ultimaRad.radicado_f1 && (
                                    <div>
                                        <p className="text-sm text-gray-600">Fase 1</p>
                                        <p className="font-semibold text-blue-600">{ultimaRad.radicado_f1}</p>
                                    </div>
                                )}
                                {ultimaRad.radicado_f2 && (
                                    <div>
                                        <p className="text-sm text-gray-600">Fase 2</p>
                                        <p className="font-semibold text-blue-600">{ultimaRad.radicado_f2}</p>
                                    </div>
                                )}
                                {ultimaRad.radicado_f3 && (
                                    <div>
                                        <p className="text-sm text-gray-600">Fase 3</p>
                                        <p className="font-semibold text-blue-600">{ultimaRad.radicado_f3}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // STUDENT FASE 1
    if (userType === 'student' && currentForm === 'student-fase1') {
        const [fase1Data, setFase1Data] = useState({
            integrante1: { nombre: '', cedula: '', email_inst: email, email_pers: '', telefono: '', semestre: '' },
            integrante2: null,
            integrante3: null,
            modalidad: 'Investigación',
            tema: '',
            tiene_tema: true,
            tutor_tematico: { nombre: '', email: '' },
            tutor_metodologico: { nombre: '', email: '' }
        });

        const handleSubmitFase1 = () => {
            if (!fase1Data.integrante1.nombre) { alert('Nombre obligatorio'); return; }
            if (!fase1Data.integrante1.semestre) { alert('Semestre obligatorio'); return; }
            if (fase1Data.tiene_tema && !fase1Data.tema) { alert('Tema obligatorio'); return; }

            const radicadoF1 = generarRadicado('F1');
            const nuevaRad = {
                id: Date.now(),
                radicado_f1: radicadoF1,
                radicado_f2: null,
                radicado_f3: null,
                modalidad: fase1Data.modalidad,
                tema: fase1Data.tema,
                integrante1: fase1Data.integrante1,
                integrante2: fase1Data.integrante2,
                integrante3: fase1Data.integrante3,
                tutor_tematico: fase1Data.tutor_tematico,
                tutor_metodologico: fase1Data.tutor_metodologico,
                fase1: { estado: 'pendiente', fecha: new Date().toLocaleDateString() },
                fase2: { estado: 'no_iniciada' },
                fase3: { estado: 'no_iniciada' }
            };

            setRadicaciones([...radicaciones, nuevaRad]);
            alert('✅ Radicación Fase 1 exitosa!\n\nRadicado: ' + radicadoF1);
            setCurrentForm('student-dashboard');
        };

        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
                    <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">FASE 1: Solicitud de Tutor</h1>
                        <button
                            onClick={() => setCurrentForm('student-dashboard')}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg"
                        >
                            ← ATRÁS
                        </button>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold mb-6">Información de Integrantes</h2>

                        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold mb-4">👤 INTEGRANTE 1 *</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={fase1Data.integrante1.nombre}
                                    onChange={(e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, nombre: e.target.value } })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Cédula"
                                    value={fase1Data.integrante1.cedula}
                                    onChange={(e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, cedula: e.target.value } })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="email"
                                    placeholder="Email institucional"
                                    value={fase1Data.integrante1.email_inst}
                                    disabled
                                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    value={fase1Data.integrante1.telefono}
                                    onChange={(e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, telefono: e.target.value } })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <select
                                    value={fase1Data.integrante1.semestre}
                                    onChange={(e) => setFase1Data({ ...fase1Data, integrante1: { ...fase1Data.integrante1, semestre: e.target.value } })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Selecciona semestre</option>
                                    {[7, 8, 9, 10, 11, 12].map(s => <option key={s} value={s}>Semestre {s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                            <h3 className="text-lg font-semibold mb-4">📚 DATOS DEL PROYECTO *</h3>
                            
                            <div className="mb-4">
                                <select
                                    value={fase1Data.modalidad}
                                    onChange={(e) => setFase1Data({ ...fase1Data, modalidad: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="Investigación">Investigación</option>
                                    <option value="Monografía">Monografía</option>
                                    <option value="Diplomado">Diplomado</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        checked={fase1Data.tiene_tema}
                                        onChange={() => setFase1Data({ ...fase1Data, tiene_tema: true })}
                                        className="mr-2"
                                    />
                                    Sí, tengo tema definido
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={!fase1Data.tiene_tema}
                                        onChange={() => setFase1Data({ ...fase1Data, tiene_tema: false })}
                                        className="mr-2"
                                    />
                                    Aún no tengo tema
                                </label>
                            </div>

                            <input
                                type="text"
                                placeholder={fase1Data.tiene_tema ? 'Tema/Área temática' : '¿Qué área te interesa?'}
                                value={fase1Data.tema}
                                onChange={(e) => setFase1Data({ ...fase1Data, tema: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setCurrentForm('student-dashboard')}
                                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={handleSubmitFase1}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                                ✓ ENVIAR RADICACIÓN
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ADMIN DASHBOARD
    if (userType === 'admin' && currentForm === 'admin-dashboard') {
        const [tabActual, setTabActual] = useState('fase1');
        const [filtroBusqueda, setFiltroBusqueda] = useState('');

        const radsFiltradas = radicaciones.filter(r => {
            const cumpleBusqueda = !filtroBusqueda || 
                                 r.integrante1?.nombre?.toLowerCase().includes(filtroBusqueda.toLowerCase());
            return cumpleBusqueda;
        });

        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Panel Coordinadora</h1>
                            <p className="text-blue-100 text-sm">{email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                            🚪 Salir
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">🔍 Filtros</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Buscar estudiante..."
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                onClick={() => descargarExcel(radsFiltradas, `Radicaciones_${tabActual}`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                            >
                                📥 Descargar Excel
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex gap-2 border-b mb-6">
                            <button
                                onClick={() => setTabActual('fase1')}
                                className={`px-6 py-3 font-semibold ${tabActual === 'fase1' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            >
                                FASE 1
                            </button>
                            <button
                                onClick={() => setTabActual('fase2')}
                                className={`px-6 py-3 font-semibold ${tabActual === 'fase2' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            >
                                FASE 2
                            </button>
                            <button
                                onClick={() => setTabActual('fase3')}
                                className={`px-6 py-3 font-semibold ${tabActual === 'fase3' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            >
                                FASE 3
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Radicado</th>
                                        <th className="px-4 py-3 text-left">Estudiante</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Modalidad</th>
                                        <th className="px-4 py-3 text-left">Estado</th>
                                        <th className="px-4 py-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {radsFiltradas.map((rad) => {
                                        const radicado = tabActual === 'fase1' ? rad.radicado_f1 : tabActual === 'fase2' ? rad.radicado_f2 : rad.radicado_f3;
                                        const estado = rad[`fase${tabActual.replace('fase', '')}`]?.estado;

                                        return (
                                            <tr key={rad.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-semibold">{radicado}</td>
                                                <td className="px-4 py-3">{rad.integrante1?.nombre}</td>
                                                <td className="px-4 py-3">{rad.integrante1?.email_inst}</td>
                                                <td className="px-4 py-3">{rad.modalidad}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                        estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {estado === 'aprobado' ? '✓ Aprobado' : estado === 'rechazado' ? '❌ Rechazado' : '⏳ Pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {estado !== 'aprobado' && (
                                                        <button
                                                            onClick={() => {
                                                                const nuevasRads = radicaciones.map(r => 
                                                                    r.id === rad.id 
                                                                        ? {
                                                                            ...r,
                                                                            [`` + `fase${tabActual.replace('fase', '')}`]: { ...r[`fase${tabActual.replace('fase', '')}`], estado: 'aprobado' }
                                                                          }
                                                                        : r
                                                                );
                                                                setRadicaciones(nuevasRads);
                                                                alert('✓ Aprobado');
                                                            }}
                                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                                                        >
                                                            Aprobar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {radsFiltradas.length === 0 && (
                            <p className="text-center text-gray-600 py-8">Sin radicaciones</p>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(USCRadicacionApp));
