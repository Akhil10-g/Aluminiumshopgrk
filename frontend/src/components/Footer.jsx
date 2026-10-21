function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <h3>GRK Aluminium Works</h3>
          <p>Premium aluminium fabrication, ACP works, and partitions for modern spaces.</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Phone: +91 9885251795, +91 9642251795</p>
          <p>Email: grkaluminiumshop@gmail.com</p>
        </div>

        <div>
          <h4>Address</h4>
          <p>Telangana, Medchal</p>
          <p>And other locations</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="/#services">Services</a>
          <a href="/#materials">Materials</a>
          <a href="/#projects">Projects</a>
          <a href="/#about">About Us</a>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} GRK Aluminium Works. All rights reserved.</p>
    </footer>
  )
}

export default Footer
